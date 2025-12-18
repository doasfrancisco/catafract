import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadTemplate, listTemplates } from '@/lib/azure';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const templateData = await request.json();
        await uploadTemplate(templateData);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Template upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const templates = await listTemplates();
        return NextResponse.json(templates);
    } catch (error) {
        console.error('Template list error:', error);
        return NextResponse.json({ error: 'Failed to list templates' }, { status: 500 });
    }
}