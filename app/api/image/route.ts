import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';
import { uploadToBlob, saveToCosmos } from '@/lib/azure';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { images, prompt } = await request.json();

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured. Please add GEMINI_API_KEY to your .env.local file' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const contents: any[] = [];

    for (const imageData of images) {
      let base64Data = '';
      let mimeType = 'image/png';

      if (imageData.startsWith('http')) {
        try {
          const imageRes = await fetch(imageData);
          if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageData}`);
          const arrayBuffer = await imageRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          base64Data = buffer.toString('base64');
          mimeType = imageRes.headers.get('content-type') || 'image/png';
        } catch (error) {
          console.error('Error fetching input image:', error);
          continue; // Skip failed images or handle error appropriately
        }
      } else {
        // Remove data URL prefix if present to get pure base64
        base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');

        // Detect mime type from data URL
        const mimeMatch = imageData.match(/^data:(image\/\w+);base64,/);
        if (mimeMatch) {
          mimeType = mimeMatch[1];
        }
      }

      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      });
    }
    contents.push({ text: prompt });

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        // model: 'gemini-2.5-flash-image',
        contents: contents,
      });
    } catch (error) {
      console.warn('Primary model failed, retrying with fallback model...', error);
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: contents,
      });
    }

    let generatedImageBase64 = null;
    let generatedText = null;

    const partResponse = response?.candidates?.[0]?.content?.parts;

    if (!partResponse) {
      return NextResponse.json(
        { error: 'No image or text generated' },
        { status: 500 }
      );
    }

    for (const part of partResponse) {
      if (part.text) {
        generatedText = part.text;
      } else if (part.inlineData) {
        // Get the base64 image data
        generatedImageBase64 = part.inlineData.data;

        // Detect the mime type from the response
        const mimeType = part.inlineData.mimeType || 'image/png';

        // Create a proper data URL for the browser
        generatedImageBase64 = `data:${mimeType};base64,${generatedImageBase64}`;
        break; // Use the first image
      }
    }

    if (!generatedImageBase64) {
      return NextResponse.json(
        {
          error: 'No image was generated',
          text: generatedText,
        },
        { status: 500 }
      );
    }

    // Upload generated image to Azure Blob Storage
    const base64Data = generatedImageBase64.replace(/^data:image\/\w+;base64,/, '');
    const mimeMatch = generatedImageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const timestamp = Date.now();
    const filename = `generated-${timestamp}.png`;
    const imageUrl = await uploadToBlob(imageBuffer, filename, mimeType);

    // Save metadata to Cosmos DB
    await saveToCosmos({
      id: `gen-${timestamp}`,
      userId: session.user?.email || 'anonymous',
      prompt: prompt,
      inputImages: images, // Store as base64 or URLs depending on your setup
      outputImageUrl: imageUrl,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      imageBase64: generatedImageBase64, // Still return base64 for immediate display
      imageUrl: imageUrl, // Also return the Azure URL
      text: generatedText,
    });

  } catch (error) {
    console.error('Error in generate image API:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}