// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import { withAuth } from '../../middleware/auth';

const execPromise = util.promisify(exec);

async function getUsers(): Promise<{ username: string }[]> {
  try {
    // Use getent to list all users
    const { stdout } = await execPromise('wsl getent passwd | wsl cut -d: -f1');
    const users = stdout.split('\n').filter(Boolean).map(username => ({ username }));
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function handler() {
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const GET = withAuth(handler);