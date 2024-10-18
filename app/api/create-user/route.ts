// app/api/create-user/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import { withAuth } from '../../middleware/auth';

const execPromise = util.promisify(exec);

async function createUser(username: string): Promise<void> {
  try {
    // Use useradd to create a new user
    await execPromise(`wsl sudo useradd ${username}`);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function handler(request: Request) {
  try {
    const { username } = await request.json();
    await createUser(username);
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/create-user:', error);
    return NextResponse.json({ 
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const POST = withAuth(handler);