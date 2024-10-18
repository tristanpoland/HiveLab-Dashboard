// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import { sign } from 'jsonwebtoken';

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

async function verifyCredentialsWSL(username: string, password: string): Promise<boolean> {
  try {
    // Use the passwd command to verify credentials
    const command = `wsl bash -c "echo '${password}' | sudo -S -k passwd -S ${username}"`;
    const { stdout } = await execPromise(command);
    
    // The passwd -S command returns the password status
    // If the account is locked or the password is expired, it will not contain 'P'
    return stdout.includes(`${username} P`);
  } catch (error) {
    console.error('WSL authentication failed:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log(`Login attempt for user: ${username}`);

    const wslAvailable = await isWSLAvailable();
    console.log(`WSL availability: ${wslAvailable ? 'Available' : 'Not Available'}`);

    if (!wslAvailable) {
      console.error('WSL is not available. This application requires WSL to be installed and properly configured.');
      return NextResponse.json({ error: 'WSL is not available' }, { status: 500 });
    }

    const isValid = await verifyCredentialsWSL(username, password);

    if (!isValid) {
      console.log('Invalid credentials');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Credentials verified, generating token');
    const token = sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error in POST /api/login:', error);
    return NextResponse.json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}