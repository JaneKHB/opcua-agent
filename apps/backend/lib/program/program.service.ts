import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

import { promises as fsPromises } from 'fs';
import { DateTime } from 'luxon';
import { CurrentDirResponseBody, PrgOfCncResponseBody, HistoryListResponseBody, HistoryInfo, ProgramDiffInfo, PrgOfCncSelectedResponseBody, TransferRequestBody, TransferResponse, TransferResponseBody, DeleteRequestBody, DeleteResponse, DeleteResponseBody, FileListResponseBody } from './dto/program.dto'
import { ProgramHistoryEntity } from './repository/program-history.entity';
import { ProgramHistoryRepository } from './repository/program-history.repository';
import { MachineRepository } from '../machine/repository/machine.repository';
import { ProgramStrategy } from './strategy/program.strategy';
import { MachineEntity } from '../machine/repository/machine.entity';
import { FileTransferProtocol } from '../machine/enum/machine.enum';
import { SmbStrategy } from './strategy/smb.strategy';
import { SftpStrategy } from './strategy/sftp.strategy';
import { FocasConnectionOptions } from './dto/program.strategy.dto';
import path from 'path';
import { CryptoUtil } from '../common/crypto/crypto.func';
import { BaseResponseBody } from '../common/functions';

@Injectable()
export class ProgramService {

    constructor(
        private readonly machineRepo: MachineRepository,
        private readonly programHistoryRepo: ProgramHistoryRepository,
    ) { }

    async getStrategy(machineId: string): Promise<ProgramStrategy> {
        const machine: MachineEntity | undefined = await this.machineRepo.findById(machineId)
        if (!machine) throw new HttpException(`Not found machine id: ${machineId}`, HttpStatus.NOT_FOUND)

        switch (machine.fileTransferProtocol) {
            case FileTransferProtocol.SMB:
                return this.createSmbStrategy(machine);
            case FileTransferProtocol.SFTP:
                return this.createSftpStrategy(machine);
            default:
                throw new HttpException(`Unsupported FileTransferProtocol: ${machine.fileTransferProtocol}`, HttpStatus.BAD_REQUEST);
        }
    }

    private createSmbStrategy(machine: MachineEntity): ProgramStrategy {
        return new SmbStrategy({
            share: 'machine.sharePath', // TODO. SMB 공유폴더 경로 받아야함.
            username: machine.fileTransferId,
            password: machine.fileTransferPw
        });
    }

    private createSftpStrategy(machine: MachineEntity): ProgramStrategy {
        return new SftpStrategy({
            host: machine.ip,
            port: machine.port,
            username: machine.fileTransferId,
            password: machine.fileTransferPw
        });
    }

    // CNC 에 설정되어있는 디폴트 폴더
    async getCurrentDir(machineId: string): Promise<CurrentDirResponseBody> {
        const strategy = await this.getStrategy(machineId)
        const currentDir = await strategy.getCurrentDir()
        return {
            currentDir: currentDir
        }
    }

    async setCurrentDir(machineId: string, path: string): Promise<void> {
        const strategy = await this.getStrategy(machineId)
        await strategy.setCurrentDir(path)
    }

    async getAllProgramDir(machineId: string, path: string): Promise<FileListResponseBody> {
        const strategy = await this.getStrategy(machineId)
        const fileListDTO = await strategy.getFileList(path)
        return {
            fileList: fileListDTO.fileList,
            folderList: fileListDTO.folderList
        }
    }

    async readPrgOfCnc(machineId: string, srcPrg: string): Promise<PrgOfCncResponseBody> {
        const strategy = await this.getStrategy(machineId)

        // 히스토리 존재하는지 유무 체크
        const historyList: HistoryInfo[] = (await this.getHistoryList(machineId, srcPrg)).historyList

        return {
            program: await strategy.getFileContent(srcPrg),
            hasHistory: historyList.length > 0
        }
    }

    async transferPrgListToPc(body: TransferRequestBody): Promise<TransferResponseBody> {
        const strategy = await this.getStrategy(body.machineId)

        // CNC 파일 다운로드 작업은 병렬로 처리하지 않도록.
        // 파일 다운로드(CNC -> PC) 시작
        const transferResponse: TransferResponse[] = []
        for (const el of body.transferRequest) {
            const transferPrgToPc: TransferResponse = await strategy.downloadFile(el.srcPrg, el.destDir)
            transferResponse.push(transferPrgToPc)
        }

        return {
            transferResponse: transferResponse
        }
    }

    async transferPrgListToCnc(body: TransferRequestBody): Promise<TransferResponseBody> {
        const strategy = await this.getStrategy(body.machineId)

        // CNC 파일 업로드 작업은 병렬로 처리하지 않도록.
        // 파일 업로드(PC -> CNC) 시작
        const transferResponse: TransferResponse[] = []
        for (const el of body.transferRequest) {

            // 프로그램 내용 획득(OLD : CNC에 이미 저장되어 있는 프로그램의 내용. 없을 경우 빈 값으로 처리, NEW : 사용자가 업로드하기 위한 파일 내용)
            const oldVersionContent = (await this.readPrgOfCnc(body.machineId, el.srcPrg)).program
            const newVersionContent = await fsPromises.readFile(el.srcPrg, 'utf-8');

            // file name 획득(destDir 마지막 문자열에 '/' 있을 경우 제거)
            const fileName = path.basename(el.srcPrg)
            const cleanedDestDir = el.destDir.endsWith('/') ? el.destDir.slice(0, -1) : el.destDir;
            const cncFilePath = cleanedDestDir + '/' + fileName;

            const transferPrgToCnc = await strategy.uploadFile(el.srcPrg, el.destDir)
            transferResponse.push(transferPrgToCnc)

            if (transferPrgToCnc.isSuccess) {
                // 업로드 성공한 경우, 프로그램 히스토리 저장
                const programHistoryEntity: ProgramHistoryEntity = {
                    uuid: await CryptoUtil.getRandomUUID(),
                    machineId: body.machineId,
                    datetime: DateTime.now().toISO(),
                    userId: 'kim',  // TODO. 로그인 기능 구현 후, 유저 정보 입력해야함
                    srcPrg: cncFilePath,
                    oldProgramContent: oldVersionContent,
                    newProgramContent: newVersionContent,
                }

                await this.programHistoryRepo.save(programHistoryEntity)
            }
        }

        return {
            transferResponse: transferResponse
        }
    }

    async deletePrgListOfCnc(body: DeleteRequestBody): Promise<DeleteResponseBody> {
        const strategy = await this.getStrategy(body.machineId)

        // CNC 파일 삭제 작업은 병렬로 처리하지 않도록.
        // 파일 삭제 시작
        const deleteResponse: DeleteResponse[] = []
        for (const el of body.deleteRequest) {
            const deletePrgOfCnc: DeleteResponse = await strategy.deleteFile(el)
            deleteResponse.push(deletePrgOfCnc)
        }

        return {
            deleteResponse: deleteResponse
        }
    }

    async createFolderOfCnc(machineId: string, folderSrc: string): Promise<void> {
        const strategy = await this.getStrategy(machineId)
        await strategy.createFolder(folderSrc)
    }

    async deleteFolderListOfCnc(body: DeleteRequestBody): Promise<DeleteResponseBody> {
        const strategy = await this.getStrategy(body.machineId)

        // CNC 폴더 삭제 작업은 병렬로 처리하지 않도록.
        // 폴더 삭제 시작
        const deleteResponse: DeleteResponse[] = []
        for (const el of body.deleteRequest) {
            const deleteFolderOfCnc: DeleteResponse = await strategy.deleteFolder(el)
            deleteResponse.push({
                src: el,
                isSuccess: deleteFolderOfCnc.isSuccess
            })
        }

        return {
            deleteResponse: deleteResponse
        }
    }

    async readSelectedPrgOfCnc(machineId: string): Promise<PrgOfCncSelectedResponseBody> {
        const strategy = await this.getStrategy(machineId)
        const selectedPrg = await strategy.readSelectedPrgOfCnc()

        return {
            mainprogram: selectedPrg.mainprogram,
            runiningprogram: selectedPrg.runiningprogram
        }
    }

    async searchSpecificPrg(machineId: string, prgnumber: number): Promise<BaseResponseBody> {
        const strategy = await this.getStrategy(machineId)
        const selectedPrg = await strategy.searchSpecificPrg(prgnumber)
        return {
            result: Number(selectedPrg)
        }
    }

    async getHistoryList(machineId: string, prgSrc: string): Promise<HistoryListResponseBody> {
        const historyList: ProgramHistoryEntity[] = await this.programHistoryRepo.findAll()
        const historyListByMachineId: ProgramHistoryEntity[] = historyList.filter((el) => {
            return el.machineId == machineId && el.srcPrg == prgSrc
        })

        return {
            machineId: machineId,
            prgSrc: prgSrc,
            historyList: historyListByMachineId.map(el => {
                return {
                    uuid: el.uuid,
                    datetime: el.datetime,
                    userId: el.userId
                }
            }),
        }
    }

    async getProgramDiffInfo(machineId: string, prgSrc: string, uuid: string): Promise<ProgramDiffInfo> {
        const programHistoryEntity: ProgramHistoryEntity | undefined = await this.programHistoryRepo.findById(uuid)

        if (!programHistoryEntity) {
            return {
                machineId: machineId,
                prgSrc: prgSrc,
                datetime: '',
                oldVersionContent: '',
                newVersionContent: ''
            }
        }

        return {
            machineId: machineId,
            prgSrc: prgSrc,
            datetime: programHistoryEntity.datetime,
            oldVersionContent: programHistoryEntity.oldProgramContent,
            newVersionContent: programHistoryEntity.newProgramContent
        }
    }

}
