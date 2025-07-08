import { ProgramStrategy } from './program.strategy';
import { SftpConnectionOptions } from '../dto/program.strategy.dto';
import { DeleteResponse, FileListResponseBody, PrgOfCncSelectedResponseBody, TransferResponse } from '../dto/program.dto';

export class SftpStrategy implements ProgramStrategy {
    constructor(private readonly conn: SftpConnectionOptions) { }

    async getCurrentDir(): Promise<string> {
        throw new Error('Method not implemented.');
    }

    async setCurrentDir(path: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async getFileList(path: string): Promise<FileListResponseBody> {
        throw new Error('Method not implemented.')
        // return await sftpListFiles(this.conn, path);
    }

    async getFileContent(srcPrg: string): Promise<string> {
        throw new Error('Method not implemented.')
    }

    async uploadFile(srcPrg: string, destDir: string): Promise<TransferResponse> {
        throw new Error('Method not implemented.')
        // await sftpUploadFile(this.conn, remotePath, buffer);
    }

    async downloadFile(srcPrg: string, destDir: string): Promise<TransferResponse> {
        throw new Error('Method not implemented.')
        // return await sftpDownloadFile(this.conn, remotePath);
    }

    async deleteFile(src: string): Promise<DeleteResponse> {
        throw new Error('Method not implemented.')
        // await sftpDeleteFile(this.conn, path);
    }

    async createFolder(path: string): Promise<void> {
        throw new Error('Method not implemented.')
        // await sftpCreateFolder(this.conn, path);
    }

    async deleteFolder(path: string): Promise<DeleteResponse> {
        throw new Error('Method not implemented.')
        // await sftpDeleteFolder(this.conn, path);
    }

    async readSelectedPrgOfCnc(): Promise<PrgOfCncSelectedResponseBody> {
        throw new Error('Method not implemented.')
    }

    async searchSpecificPrg(prgnumber: number): Promise<string> {
        throw new Error('Method not implemented.')
    }
}
