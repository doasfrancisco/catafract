import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user?.email) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    try {
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error('Error fetching user tiktok status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
