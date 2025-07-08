import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MachineRepository } from './repository/machine.repository'
import { MachineResponseBody, MachineRequestBody, RmsMachineDTO, RmsMachineResponseBody, ValidationMachineFile, FileImportMachineBody } from './dto/machine.dto'
import { MachineEntity } from './repository/machine.entity'
import axios from 'axios'
import { FastifyReply, FastifyRequest } from 'fastify'
import { MultipartFile } from 'fastify-multipart'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { FileTransferProtocol, MachineType } from './enum/machine.enum'
import { CryptoUtil } from '../common/crypto/crypto.func'

@Injectable()
export class MachineService {
    constructor(private readonly machineRepo: MachineRepository) { }

    async getMachineList(): Promise<MachineResponseBody[]> {
        const machineEntityList: MachineEntity[] = await this.machineRepo.findAll()
        return machineEntityList.map(el => {
            return {
                machineType: el.machineType,
                machineId: el.machineId,
                name: el.name,
                ip: el.ip,
                port: el.port,
                fileTransferProtocol: el.fileTransferProtocol,
                fileTransferId: el.fileTransferId,
                fileTransferPw: el.fileTransferPw
            }
        })
    }

    async addMachineInfo(body: MachineRequestBody): Promise<void> {
        // uuid 생성
        const machineEntity: MachineEntity = body.toEntity()
        machineEntity.machineId = await CryptoUtil.getRandomUUID()

        await this.machineRepo.save(machineEntity)
    }

    async addMachineInfoFromRMS(): Promise<void> {
        // TODO. RMS 머신 호출할때 인증 또는 다른 URL 처리되도록 수정 필요
        const response = await axios.get<RmsMachineResponseBody>('https://api.rms-plus.com/machine/all/11111')
        const rmsMachineList = response.data

        const machineEntityList: MachineEntity[] = rmsMachineList.data.map((el: RmsMachineDTO) => {
            return {
                // TODO. (2025.06.27) RMS 에서 가져온 머신정보들은 모두 FANUC 이라고 판단. 추후 SIEMENS 정보에 맞게 수정 필요.
                machineType: MachineType.FANUC,
                machineId: el.machineId,
                name: el.name,
                ip: el.ip || '',
                port: 8193,
                fileTransferProtocol: FileTransferProtocol.FOCAS,
                fileTransferId: '',
                fileTransferPw: ''
            }
        })

        await this.machineRepo.saveAll(machineEntityList)
    }

    async editMachineInfo(machineId: string, body: MachineRequestBody): Promise<void> {
        const machineEntity = body.toEntity()
        machineEntity.machineId = machineId
        await this.machineRepo.update(machineId, machineEntity)
    }

    async deleteMachineInfo(machineId: string): Promise<void> {
        await this.machineRepo.delete(machineId)
    }

    async importMachine(req: FastifyRequest): Promise<void> {
        // 데이터 정합성 체크
        const file: MultipartFile = await req.file()
        const buffer = await file.toBuffer()

        const validationResult: ValidationMachineFile = await this.validateMachineInfo(buffer)
        if (!validationResult.isSuccess) {
            throw new HttpException(validationResult.reason, HttpStatus.BAD_REQUEST)
        }

        const machineEntityList = JSON.parse(buffer.toString('utf-8')) as MachineEntity[]
        await this.machineRepo.saveAll(machineEntityList)
    }

    async exportMachine(res: FastifyReply): Promise<void> {
        const machineList: MachineEntity[] = await this.machineRepo.findAll()

        res.header('Content-Disposition', 'attachment filename="machine_list.json"')
        res.header('Content-Type', 'application/json"')
        res.send(JSON.stringify(machineList, null, 2))
    }

    async validateMachineInfo(buffer: Buffer): Promise<ValidationMachineFile> {
        if (!buffer || buffer.length === 0) {
            return new ValidationMachineFile(false, 'Invalid file or file size is 0')
        }

        try {
            const content = buffer.toString('utf-8')
            const parsed = JSON.parse(content)

            // 배열인지 확인
            if (!Array.isArray(parsed)) {
                return new ValidationMachineFile(false, 'The data is not an array.')
            }

            // 필수 항목이 있는지, 타입이 맞는지 확인
            for (let i = 0; i < parsed.length; i++) {
                const raw = parsed[i]
                const instance = plainToInstance(FileImportMachineBody, raw)
                const errors = await validate(instance)

                if (errors.length > 0) {
                    return new ValidationMachineFile(false, 'The data Type is incorrect or the data item does not exist.')
                }
            }

            return new ValidationMachineFile(true, 'success')
        } catch (e) {
            return new ValidationMachineFile(false, `Unknown Error: ${e}`)
        }
    }
}
