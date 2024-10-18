// app/middleware/auth.ts
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Use an environment variable in production

async function isWSLAvailable(): Promise<boolean> {
  try {
    await execPromise('wsl echo "WSL is available"');
    return true;
  } catch (error) {
    console.error('WSL check failed:', error);
    return false;
  }
}

export function withAuth(handler: Function) {
  return async function(request: Request) {
    const wslAvailable = await isWSLAvailable();
    if (!wslAvailable) {
      return NextResponse.json({ error: 'WSL is not available' }, { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verify(token, SECRET_KEY);
      // You can add the decoded user info to the request if needed
      // For example: request.user = decoded;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return handler(request);
  }
}