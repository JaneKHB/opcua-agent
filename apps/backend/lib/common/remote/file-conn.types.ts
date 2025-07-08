export interface SmbConnectionOptions {
  share: string;
  username: string;
  password: string;
  domain?: string;
  autoCloseTimeout?: number;
}

export interface SftpConnectionOptions {
  host: string;
  username: string;
  password: string;
  port?: number;
  timeout?: number;
}