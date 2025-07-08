import { Controller, Headers, Post, Get, Delete, Patch, Body, Query, Logger, Res, Req } from '@nestjs/common'
import { ApiQuery, ApiBody, ApiTags, ApiOperation, ApiConsumes, ApiOkResponse, ApiCreatedResponse, ApiResponse, } from '@nestjs/swagger'
import { MachineService } from './machine.service'
import { MachineResponseBody, MachineRequestBody } from './dto/machine.dto'
import { FastifyReply, FastifyRequest } from 'fastify'


@ApiTags('machine')
@Controller('machine')
export class MachineController {

    constructor(private readonly machineService: MachineService) { }
    private readonly logger: Logger = new Logger(MachineController.name)

    // 장비 리스트 정보 조회
    @Get('')
    @ApiOperation({ description: '장비 리스트 정보 조회', operationId: 'getMachineList' })
    @ApiResponse({ type: MachineResponseBody, isArray: true })
    async getMachineList(@Headers('X-Electron') electronHeader: string): Promise<MachineResponseBody[]> {
        this.logger.log(`[getMachineList] Headers: ${electronHeader}`)
        return this.machineService.getMachineList()
    }

    // 장비 정보 추가
    @Post('')
    @ApiOperation({ description: '장비 정보 추가', operationId: 'addMachineInfo' })
    @ApiBody({ type: MachineRequestBody })
    async addMachineInfo(
        @Headers('X-Electron') electronHeader: string,
        @Body() body: MachineRequestBody
    ): Promise<void> {
        this.logger.log(`[addMachineInfo] Headers: ${electronHeader}`)
        return this.machineService.addMachineInfo(body)
    }

    // 장비 정보 추가(RMS)
    @Post('/server')
    @ApiOperation({ description: '장비 정보 추가(RMS 로부터 장비정보를 들고와서 추가)', operationId: 'addMachineInfoFromRMS' })
    async addMachineInfoFromRMS(@Headers('X-Electron') electronHeader: string): Promise<void> {
        this.logger.log(`[addMachineInfoFromRMS] Headers: ${electronHeader}`)
        return this.machineService.addMachineInfoFromRMS()
    }

    // 장비 정보 수정
    @Patch('')
    @ApiOperation({ description: '장비 정보 수정', operationId: 'editMachineInfo' })
    @ApiQuery({ name: 'machine_id' })
    @ApiBody({ type: MachineRequestBody })
    async editMachineInfo(
        @Headers('X-Electron') electronHeader: string,
        @Query('machine_id') machineId: string,
        @Body() body: MachineRequestBody
    ): Promise<void> {
        this.logger.log(`[editMachineInfo] Headers: ${electronHeader}`)
        return this.machineService.editMachineInfo(machineId, body)
    }

    // 장비 정보 삭제
    @Delete('')
    @ApiOperation({ description: '장비 정보 삭제', operationId: 'deleteMachine' })
    @ApiQuery({ name: 'machine_id' })
    async deleteMachine(
        @Headers('X-Electron') electronHeader: string,
        @Query('machine_id') machineId: string
    ): Promise<void> {
        this.logger.log(`[deleteMachineInfo] Headers: ${electronHeader}`)
        return this.machineService.deleteMachineInfo(machineId)
    }

    // 장비 정보 import(json)
    @Post('import')
    @ApiOperation({ description: '장비 정보 import(json)', operationId: 'importMachine' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async importMachine(@Req() req: FastifyRequest): Promise<void> {
        return this.machineService.importMachine(req)
    }

    // 장비 정보 export(json)
    @Get('export')
    @ApiOperation({ description: '장비 정보 export(json)', operationId: 'exportMachine' })
    async exportMachine(@Res() res: FastifyReply): Promise<void> {
        return this.machineService.exportMachine(res)
    }
}