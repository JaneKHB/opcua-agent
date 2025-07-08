import { ApiProperty } from "@nestjs/swagger"
import { BaseResponseBody } from "../../common/functions"

export class HealthResponseBody extends BaseResponseBody {
    @ApiProperty({ default: 'success' })
    message: string
}

export class CurrentDirResponseBody {
    @ApiProperty({ default: '//CNC_MEM/USER/PATH1' })
    currentDir: string
}

// TODO. swagger response body 넣어줘야함.
export class FileListResponseBody {
    @ApiProperty({
        default: {
            fileList: [
                {
                    name: 'O8970',
                    size: 4500,
                    datetime: '2025-06-01 01:01:01'
                },
                {
                    name: 'O2006',
                    size: 67500,
                    datetime: '2025-06-02 04:44:14'
                }
            ],
            folderList: [
                {
                    name: 'O0EST',
                    datetime: '2025-06-01 01:01:01'
                },
                {
                    name: 'O0est',
                    datetime: '2025-06-01 01:01:01'
                }
            ]
        }
    })
    fileList: FileInfo[]
    folderList: FolderInfo[]
}

export class FileInfo {
    name: string
    size: number
    datetime: string
}

export class FolderInfo {
    name: string
    datetime: string
}

// TODO. 삭제 예정
export class AllProgramDirResponseBody extends BaseResponseBody {
    @ApiProperty({
        default: [
            {
                data_kind: 0,
                year: 0,
                mon: 0,
                day: 0,
                hour: 0,
                min: 0,
                sec: 0,
                size: 0,
                attr: 0,
                d_f: "O0EST",
                comment: "",
                o_time: ""
            },
            {
                data_kind: 1,
                year: 2025,
                mon: 8,
                day: 26,
                hour: 15,
                min: 57,
                sec: 42,
                size: 500,
                attr: 0,
                d_f: "O0001",
                comment: "BALL BAR X-Y",
                o_time: ""
            },
        ],
    })
    allProgramsList: FocasProgramInfo[]

    @ApiProperty({ default: 2 })
    allProgNum: number
}

export class FocasProgramInfo {
    data_kind: number
    year: number
    mon: number
    day: number
    hour: number
    min: number
    sec: number
    size: number
    attr: number
    d_f: string
    comment: string
    o_time: string
}

export class PrgOfCncResponseBody {
    @ApiProperty({ default: '%\nO0001(BALL BAR X-Y)\nM184 \nG17\n/G5.1Q1R10 \nG90G0G56X101.5Y0.Z0. \nM00\nG0 \nM30\n \n%' })
    program: string

    @ApiProperty({ default: false })
    hasHistory: boolean
}

// 업로드(PC -> CNC), 다운로드(CNC -> PC) 모두 같은 RequestBody 사용
export class TransferRequestBody {
    @ApiProperty({ default: '1111' })
    machineId: string

    @ApiProperty({
        default: [
            { srcPrg: '(transferPrgToCnc) C:\\Users\\i0215600\\Downloads\\NCProgram\\O0001', destDir: '//CNC_MEM/USER/PATH1' },
            { srcPrg: '(transferPrgToPc) //CNC_MEM/USER/PATH1/O0001', destDir: 'C:\\Users\\i0215600\\Downloads\\NCProgram' }]
    })
    transferRequest: TransferRequest[]
}

export class TransferRequest {
    srcPrg: string
    destDir: string
}

// 업로드(PC -> CNC), 다운로드(CNC -> PC) 모두 같은 ResponseBody 사용
export class TransferResponseBody {
    @ApiProperty({
        default: [
            {
                srcPrg: 'C:\\Users\\i0215600\\Downloads\\NCProgram\\O0001',
                destDir: '//CNC_MEM/USER/PATH1',
                isSuccess: true
            },
            {
                srcPrg: 'C:\\Users\\i0215600\\Downloads\\NCProgram\\O0002',
                destDir: '//CNC_MEM/USER/PATH1',
                isSuccess: false
            }
        ]
    })
    transferResponse: TransferResponse[]
}

export class TransferResponse {
    srcPrg: string
    destDir: string
    isSuccess: boolean
}

export class DeleteRequestBody {
    @ApiProperty({ default: '1111' })
    machineId: string

    @ApiProperty({
        default: [
            '(DeletePrgOfCnc) //CNC_MEM/USER/PATH1/O0001', '(DeleteFolderOfCnc) //CNC_MEM/USER/PATH1/testfolder']
    })
    deleteRequest: string[]
}

export class DeleteResponseBody {
    @ApiProperty({
        default: [
            {
                src: '//CNC_MEM/USER/PATH1/O0001',
                isSuccess: true
            },
            {
                src: '//CNC_MEM/USER/PATH1/O0002',
                isSuccess: false
            }
        ]
    })
    deleteResponse: DeleteResponse[]
}

export class DeleteResponse {
    src: string
    isSuccess: boolean
}

export class HistoryListResponseBody {
    @ApiProperty({ default: 'd709b3a2-4175-4e4a-9ca2-95cedb5eaffc' })
    machineId: string

    @ApiProperty({ default: '//CNC_MEM/USER/PATH1/O0001' })
    prgSrc: string

    @ApiProperty({
        default: [
            {
                uuid: '6d710f8e-b4fb-4386-908e-8deb3a4ea447',
                datetime: '2025-06-25T15:40:11.490+09:00',
                userId: 'kim'
            },
            {
                uuid: '91ddeb16-ed4b-4a60-a8cc-f3583c5868c3',
                datetime: '2025-06-25T16:03:22.033+09:00',
                userId: 'kim'
            }
        ]
    })
    historyList: HistoryInfo[]
}

export class HistoryInfo {
    uuid: string
    datetime: string
    userId: string
}

export class ProgramDiffInfo {
    @ApiProperty({ default: '6d710f8e-b4fb-4386-908e-8deb3a4ea447' })
    machineId: string

    @ApiProperty({ default: '//CNC_MEM/USER/PATH1/O0001' })
    prgSrc: string

    @ApiProperty({ default: '2025-06-25T15:40:11.490+09:00' })
    datetime: string

    @ApiProperty({ default: '%\nO0001(BALL BAR X-Y)\nM184 \nG17\n/G5.1Q1R10 \nG90G0G56X101.5Y0.Z0. \nM00\nG0 \nM30\n \n%' })
    oldVersionContent: string

    @ApiProperty({ default: '%\nO0001(BALL BAR X-Y)\nM30\n \n%' })
    newVersionContent: string
}

export class PrgOfCncSelectedResponseBody {
    @ApiProperty({ default: 'O2006' })
    mainprogram: string

    @ApiProperty({ default: 'O2006' })
    runiningprogram: string
}

export class IOCncResponseBody extends BaseResponseBody {
    IoResult: boolean
    Message: string
}