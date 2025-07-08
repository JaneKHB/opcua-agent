import { ProgramStrategy } from './program.strategy'
import { SmbConnectionOptions } from '../dto/program.strategy.dto'
import { DeleteResponse, FileListResponseBody, PrgOfCncSelectedResponseBody, TransferResponse } from '../dto/program.dto'

export class SmbStrategy implements ProgramStrategy {
    constructor(private readonly conn: SmbConnectionOptions) { }

    async getCurrentDir(): Promise<string> {
        throw new Error('Method not implemented.')
    }

    async setCurrentDir(path: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    async getFileList(path: string): Promise<FileListResponseBody> {
        throw new Error('Method not implemented.')

        // const list = await smbListFiles(this.conn, path)

        // SMB는 폴더/파일 구분 정보 없으므로 단순 문자열 리스트
        // return list.map((name) => ({
        //     name,
        //     isDirectory: name.endsWith('/'), // 가정: 슬래시로 폴더 표시 시도
        // }))
    }

    async getFileContent(srcPrg: string): Promise<string> {
        throw new Error('Method not implemented.')
    }

    async uploadFile(srcPrg: string, destDir: string): Promise<TransferResponse> {
        throw new Error('Method not implemented.')
        // await smbUploadFile(this.conn, remotePath, buffer)
    }

    async downloadFile(srcPrg: string, destDir: string): Promise<TransferResponse> {
        throw new Error('Method not implemented.')
        // return await smbDownloadFile(this.conn, remotePath)
    }

    async deleteFile(src: string): Promise<DeleteResponse> {
        throw new Error('Method not implemented.')
        // await smbDeleteFile(this.conn, path)
    }

    async createFolder(path: string): Promise<void> {
        throw new Error('Method not implemented.')
        // await smbCreateFolder(this.conn, path)
    }

    async deleteFolder(path: string): Promise<DeleteResponse> {
        throw new Error('Method not implemented.')
        // await smbDeleteFolder(this.conn, path)
    }

    async readSelectedPrgOfCnc(): Promise<PrgOfCncSelectedResponseBody> {
        throw new Error('Method not implemented.')
    }

    async searchSpecificPrg(prgnumber: number): Promise<string> {
        throw new Error('Method not implemented.')
    }
}
