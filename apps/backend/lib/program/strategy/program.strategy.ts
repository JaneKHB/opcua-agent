import { DeleteResponse, FileListResponseBody, PrgOfCncSelectedResponseBody, TransferResponse, TransferResponseBody } from "../dto/program.dto"

export interface ProgramStrategy {
  // 경로, 리스트
  getCurrentDir(): Promise<string>
  setCurrentDir(path: string): Promise<void>
  getFileList(path: string): Promise<FileListResponseBody>

  // 프로그램 내용
  getFileContent(srcPrg: string): Promise<string>

  // 파일 처리
  downloadFile(srcPrg: string, destDir: string): Promise<TransferResponse>
  uploadFile(srcPrg: string, destDir: string): Promise<TransferResponse>
  deleteFile(src: string): Promise<DeleteResponse>

  // 폴더 처리
  createFolder(path: string): Promise<void>
  deleteFolder(path: string): Promise<DeleteResponse>

  // 현재 프로그램
  readSelectedPrgOfCnc(): Promise<PrgOfCncSelectedResponseBody>

  searchSpecificPrg(prgnumber: number): Promise<string>  // TODO. 어떤 기능인지 확인해봐야함.
}