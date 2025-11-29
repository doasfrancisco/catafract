import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getUser } from '@/lib/azure';

export async function GET(request: NextRequest) {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await getUser(session.user.email);
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error fetching user status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
