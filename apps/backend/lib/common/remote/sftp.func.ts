import SftpClient from 'ssh2-sftp-client';
import { SftpConnectionOptions } from './file-conn.types'

async function connectClient(opts: SftpConnectionOptions): Promise<SftpClient> {
  const client = new SftpClient();
  await client.connect({
    host: opts.host,
    port: opts.port ?? 22,
    username: opts.username,
    password: opts.password,
    readyTimeout: opts.timeout ?? 10000,
  });
  return client;
}

export async function sftpListFiles(opts: SftpConnectionOptions, dirPath: string): Promise<any[]> {
  const client = await connectClient(opts);
  const result = await client.list(dirPath);
  await client.end();
  return result;
}

export async function sftpUploadFile(opts: SftpConnectionOptions, filePath: string, buffer: Buffer): Promise<void> {
  const client = await connectClient(opts);
  await client.put(buffer, filePath);
  await client.end();
}

export async function sftpDownloadFile(opts: SftpConnectionOptions, filePath: string): Promise<Buffer> {
  const client = await connectClient(opts);
  const data = await client.get(filePath, undefined, { encoding: null });
  await client.end();
  return data;
}

export async function sftpCreateFolder(opts: SftpConnectionOptions, dirPath: string): Promise<void> {
  const client = await connectClient(opts);
  await client.mkdir(dirPath, true);
  await client.end();
}

export async function sftpDeleteFolder(opts: SftpConnectionOptions, dirPath: string): Promise<void> {
  const client = await connectClient(opts);
  await client.rmdir(dirPath, true);
  await client.end();
}

export async function sftpDeleteFile(opts: SftpConnectionOptions, filePath: string): Promise<void> {
  const client = await connectClient(opts);
  await client.delete(filePath);
  await client.end();
}