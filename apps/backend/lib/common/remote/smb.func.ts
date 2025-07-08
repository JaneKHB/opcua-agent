import SMB2 from 'smb2';
import { SmbConnectionOptions } from './file-conn.types';

function createClient(opts: SmbConnectionOptions): SMB2 {
  throw new Error('')
}

export async function smbListFiles(opts: SmbConnectionOptions, dirPath: string): Promise<string[]> {
  throw new Error('')
}

export async function smbUploadFile(opts: SmbConnectionOptions, filePath: string, buffer: Buffer): Promise<void> {
  throw new Error('')
}

export async function smbDownloadFile(opts: SmbConnectionOptions, filePath: string): Promise<Buffer> {
  throw new Error('')
}

export async function smbCreateFolder(opts: SmbConnectionOptions, dirPath: string): Promise<void> {
  throw new Error('')
}

export async function smbDeleteFolder(opts: SmbConnectionOptions, dirPath: string): Promise<void> {
  throw new Error('')
}

export async function smbDeleteFile(opts: SmbConnectionOptions, filePath: string): Promise<void> {
  throw new Error('')
}