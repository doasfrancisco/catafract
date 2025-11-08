import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uploadId = searchParams.get('uploadId');
    const assetId = searchParams.get('assetId');

    if (uploadId) {
      // Get upload and associated asset
      const upload = await mux.video.uploads.retrieve(uploadId);

      if (upload.asset_id) {
        const asset = await mux.video.assets.retrieve(upload.asset_id);

        return NextResponse.json({
          uploadId: upload.id,
          assetId: asset.id,
          status: asset.status,
          playbackId: asset.playback_ids?.[0]?.id,
          duration: asset.duration,
        });
      }

      return NextResponse.json({
        uploadId: upload.id,
        status: 'processing',
      });
    }

    if (assetId) {
      // Get asset directly
      const asset = await mux.video.assets.retrieve(assetId);

      return NextResponse.json({
        assetId: asset.id,
        status: asset.status,
        playbackId: asset.playback_ids?.[0]?.id,
        duration: asset.duration,
      });
    }

    return NextResponse.json(
      { error: 'uploadId or assetId required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching Mux asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}
