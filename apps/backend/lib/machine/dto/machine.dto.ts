import { ApiProperty } from "@nestjs/swagger"
import { MachineEntity } from "../repository/machine.entity"
import { FileTransferProtocol, MachineType } from "../enum/machine.enum"
import { BaseResponseBody } from "../../common/functions"
import { IsEnum, IsIP, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class MachineResponseBody {
    @ApiProperty({ default: MachineType.FANUC })
    machineType: MachineType

    @ApiProperty({ default: '9e775852-200c-4e8b-a54c-17647ffe964d' })
    machineId: string

    @ApiProperty({ default: 'Machine #1' })
    name: string

    @ApiProperty({ default: '1.1.1.1' })
    ip: string

    @ApiProperty({ default: '8193' })
    port: number

    @ApiProperty({ default: FileTransferProtocol.FOCAS })
    fileTransferProtocol: FileTransferProtocol

    @ApiProperty({ default: 'id' })
    fileTransferId: string       // FOCAS 인 경우에는 필요 없음. 지멘스(SMB, SFTP) 만 필요

    @ApiProperty({ default: 'password' })
    fileTransferPw: string       // FOCAS 인 경우에는 필요 없음. 지멘스(SMB, SFTP) 만 필요
}

export class MachineRequestBody {
    @ApiProperty({ default: 'FANUC' })
    @IsNotEmpty()
    machineType: MachineType

    @ApiProperty({ default: 'Machine #1' })
    @IsNotEmpty()
    name: string

    @ApiProperty({ default: '1.1.1.1' })
    @IsNotEmpty()
    ip: string

    @ApiProperty({ default: '8193' })
    @IsNotEmpty()
    port: number

    @ApiProperty({ default: 'FOCAS' })
    @IsNotEmpty()
    fileTransferProtocol: FileTransferProtocol

    @ApiProperty({ default: 'id' })
    @IsNotEmpty()
    fileTransferId: string

    @ApiProperty({ default: 'pw' })
    @IsNotEmpty()
    fileTransferPw: string

    toEntity(): MachineEntity {
        const machineEntity = new MachineEntity()
        machineEntity.machineType = this.machineType
        machineEntity.name = this.name
        machineEntity.ip = this.ip
        machineEntity.port = this.port
        machineEntity.fileTransferProtocol = this.fileTransferProtocol
        machineEntity.fileTransferId = this.fileTransferId
        machineEntity.fileTransferPw = this.fileTransferPw
        return machineEntity
    }
}

export class FileImportMachineBody {
    @IsEnum(MachineType)
    machineType: MachineType;

    @IsString()
    @IsNotEmpty()
    machineId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsIP()
    @IsNotEmpty()
    ip: string;

    @IsNumber()
    @IsNotEmpty()
    port: number;

    @IsEnum(FileTransferProtocol)
    @IsNotEmpty()
    fileTransferProtocol: FileTransferProtocol;

    @IsString()
    fileTransferId: string;

    @IsString()
    fileTransferPw: string;
}

export class FileImportResponseBody extends BaseResponseBody {
    @ApiProperty({ default: 'success' })
    reason: string
}

export class ValidationMachineFile {
    isSuccess: boolean
    reason: string

    constructor(isSuccess: boolean, reason: string) {
        this.isSuccess = isSuccess
        this.reason = reason
    }
}

export class RmsMachineResponseBody {
    status: string
    data: RmsMachineDTO[]
}

export class RmsMachineDTO {
    machineId: string
    machineTypeId?: string
    machineTypeName?: string
    machineModelId?: number
    machineModelName?: string
    instructionManual?: string
    operationManual?: string
    ezWorkManual?: string
    etc1Manual?: string
    etc2Manual?: string
    machineImageId?: number
    machineImageSource?: string
    plantId?: string
    groupId?: string
    groupName?: string
    lineId?: string
    name: string
    isUse?: boolean
    ip?: string
    ncType?: string
    createdAt?: Date
}