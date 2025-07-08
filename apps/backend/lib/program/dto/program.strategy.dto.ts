export interface FocasConnectionOptions {
  ip: string
  port: number
}

export interface SmbConnectionOptions {
  share: string
  username: string
  password: string
}

export interface SftpConnectionOptions {
  host: string
  port: number
  username: string
  password: string
}
