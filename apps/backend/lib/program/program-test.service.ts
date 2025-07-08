import { Injectable } from '@nestjs/common'
import { HistoryListResponseBody, HistoryInfo, ProgramDiffInfo, FocasProgramInfo, PrgOfCncResponseBody } from './dto/program.dto'
import { ProgramHistoryEntity } from './repository/program-history.entity'
import { ProgramHistoryRepository } from './repository/program-history.repository'
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { DateTime } from 'luxon';
import { app } from 'electron'
import { CryptoUtil } from '../common/crypto/crypto.func';

@Injectable()
export class ProgramTestService {

    constructor(private readonly programHistoryRepo: ProgramHistoryRepository) { }

    private RUN_MODE = 'WSL'  // or 'WSL'

    private readonly APP_GET_PATH = (this.RUN_MODE == 'ELECTRON') ?
        app.getPath('userData') :
        this.convertWindowsPathToWsl('C:\\Users\\i0215600\\AppData\\Roaming\\prg-electron')

    // HACK. 2025.06.19. TEST 장비(10.33.64.71) 연결 끊김으로 인해 Front용 테스트용 데이터 return(handle 1일때.). 추후 테스트 코드는 모두 삭제.
    async getCurrentDir() {
        return {
            result: 0,
            currentDir: '//CNC_MEM/USER/PATH1',
            mainProgramName: 'O1602'
        }
    }

    async getAllProgramDir() {
        // 테스트용 코드에서 사용할 프로그램 파일 저장 경로
        // const testLocalDir = path.join(app.getPath('userData'), 'testProgramDir');
        const testLocalDir = path.join(this.APP_GET_PATH, 'testProgramDir');

        // 테스트용 프로그램 파일 저장 경로 생성
        const mkdir = await fsPromises.mkdir(testLocalDir, { recursive: true });

        // 테스트용 저장경로에 저장되어있는 파일 이름들
        const fileNames = await fsPromises.readdir(testLocalDir);
        const fileList: FocasProgramInfo[] = [];
        for (const fileName of fileNames) {
            const filePath = path.join(testLocalDir, fileName);
            const stat = await fsPromises.stat(filePath);

            // 날짜 정보 추출
            const date = new Date(stat.mtime); // 수정 시간 기준
            const year = date.getFullYear();
            const mon = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const min = date.getMinutes();
            const sec = date.getSeconds();

            fileList.push({
                data_kind: 1,
                year,
                mon,
                day,
                hour,
                min,
                sec,
                size: stat.size,
                attr: 0,
                d_f: fileName,
                comment: '',
                o_time: ''
            });
        }

        return {
            result: 0,
            allProgramsList: fileList,
            allProgNum: fileList.length
        }
    }

    async getNCfiles() {
        return this.getAllProgramDir()
    }

    async getReadPrgOfCnc(machineId: string, srcPrg: string): Promise<PrgOfCncResponseBody> {
        const fileName = path.basename(srcPrg)
        const fileFullPath = path.join(this.APP_GET_PATH, fileName)
        const fileContent = await fsPromises.readFile(fileFullPath, 'utf-8');

        // 히스토리 존재하는지 유무 체크
        const historyList: HistoryInfo[] = (await this.getHistoryList(machineId, srcPrg)).historyList

        return {
            program: fileContent,
            hasHistory: historyList.length > 0
        }
    }

    // 테스트용 코드에서는 CNC 가 아닌, 실제 로컬 PC 로 저장 예정
    async transferPrgToCnc(machineId: string, srcPrg: string, destDir: string) {
        // WSL 환경에 맞게 경로 변경
        srcPrg = (this.RUN_MODE == 'ELECTRON') ? srcPrg : this.convertWindowsPathToWsl(srcPrg)

        const fileName = path.basename(srcPrg)

        // 테스트용 코드에서 사용할 프로그램 파일 저장 경로
        // const testLocalDir = path.join(app.getPath('userData'), 'testProgramDir');
        const testLocalDir = path.join(this.APP_GET_PATH, 'testProgramDir');

        // 테스트용 프로그램 파일 저장 경로 생성
        await fsPromises.mkdir(testLocalDir, { recursive: true });

        // OLD Version 프로그램 내용 획득(CNC에 이미 저장되어 있는 프로그램의 내용)
        const oldVersionFilePath = path.join(testLocalDir, fileName)
        const oldVersionContent = fs.existsSync(oldVersionFilePath) ? await fsPromises.readFile(path.join(testLocalDir, fileName), 'utf-8') : ''

        // NEW Version 프로그램 내용 획득(사용자가 업로드하기 위한 프로그램의 내용)
        const newVersionContent = await fsPromises.readFile(srcPrg, 'utf-8');

        // 프로그램 업로드(PC -> CNC)
        await fsPromises.copyFile(
            srcPrg,
            path.join(testLocalDir, path.basename(srcPrg))
        )

        // 프로그램 히스토리 저장
        const programHistoryEntity: ProgramHistoryEntity = {
            uuid: await CryptoUtil.getRandomUUID(),
            machineId: machineId,
            datetime: DateTime.now().toISO(),
            userId: 'kim',
            srcPrg: srcPrg,
            oldProgramContent: oldVersionContent,
            newProgramContent: newVersionContent,
        }

        await this.programHistoryRepo.save(programHistoryEntity)

        return {
            result: 0
        };
    }

    async getHistoryList(machineId: string, prgSrc: string): Promise<HistoryListResponseBody> {
        const historyList: ProgramHistoryEntity[] = await this.programHistoryRepo.findAll()
        const historyListByMachineId: ProgramHistoryEntity[] = historyList.filter((el) => {
            el.machineId == machineId && el.srcPrg == prgSrc
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


    convertWindowsPathToWsl(winPath: string): string {
        return '/mnt/' + winPath[0].toLowerCase() + winPath.slice(2).replace(/\\/g, '/');
    }
}
