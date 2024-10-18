// app/lib/users.ts
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

interface User {
  username: string;
}

function isWSL(): boolean {
  return os.release().toLowerCase().includes('microsoft');
}

async function runCommand(command: string): Promise<string> {
  if (isWSL()) {
    return (await execPromise(`wsl -e bash -c "${command}"`)).stdout;
  } else {
    return (await execPromise(command)).stdout;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    let command: string;
    if (process.platform === 'win32') {
      // Windows-specific command (not WSL)
      command = 'wmic useraccount get name';
    } else {
      // Linux and WSL
      command = "getent passwd | cut -d: -f1";
    }

    const stdout = await runCommand(command);
    let users: string[];
    
    if (process.platform === 'win32' && !isWSL()) {
      // Parse Windows output
      users = stdout.split('\r\n').slice(1).filter(Boolean);
    } else {
      // Parse Linux/WSL output
      users = stdout.split('\n').filter(Boolean);
    }

    console.log('Users fetched:', users);
    return users.map(username => ({ username }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createUser(username: string): Promise<void> {
  try {
    let command: string;
    if (process.platform === 'win32' && !isWSL()) {
      // Windows-specific command (not WSL)
      command = `net user ${username} /add`;
    } else {
      // Linux and WSL (Note: This requires sudo privileges)
      command = `sudo useradd ${username}`;
    }

    // For demonstration, we'll just echo the command instead of executing it
    await runCommand(`echo "Would execute: ${command}"`);
    console.log('User created:', username);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}