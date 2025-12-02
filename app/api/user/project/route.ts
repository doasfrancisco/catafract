import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createProject, getProjects } from '@/lib/azure';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const userId = body.userId;
        const name = body.name;
        const createdDate = new Date();

        const newProject = {
            "id": crypto.randomUUID(),
            "userId": userId,
            "name": name,
            "createdDate": createdDate
        }

        const project = await createProject(newProject);
        if (!project) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
        return NextResponse.json(newProject, { status: 200 });
    } catch (error) {
        console.error('Error fetching user status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = request.nextUrl.searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
        const projects = await getProjects(userId);
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching user status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}