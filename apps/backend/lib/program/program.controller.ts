import { Controller, Headers, Get, Post, Delete, Logger, Query, Body, BadRequestException } from '@nestjs/common'
import { ApiQuery, ApiTags, ApiOperation, ApiHeader, ApiBody, ApiResponse } from '@nestjs/swagger'
import { ProgramService } from './program.service'
import { CurrentDirResponseBody, HistoryListResponseBody, PrgOfCncResponseBody, ProgramDiffInfo, PrgOfCncSelectedResponseBody, TransferRequestBody, TransferResponseBody, DeleteRequestBody, DeleteResponseBody, HealthResponseBody, FileListResponseBody } from './dto/program.dto'
import { ProgramTestService } from './program-test.service'
import { BaseResponseBody } from '../common/functions'

@ApiTags('program')
@Controller('program')
export class ProgramController {
  constructor(
    private readonly programService: ProgramService,
    private readonly programTestService: ProgramTestService
  ) { }

  private readonly logger: Logger = new Logger(ProgramController.name)

  @Get('health')
  @ApiOperation({ description: 'health 체크', operationId: 'checkHealth' })
  @ApiHeader({ name: 'X-Wait-On' })
  async checkHealth(@Headers('X-Wait-On') electronHeader: string): Promise<void> {
    this.logger.log(`[checkHealth] Headers: ${electronHeader}`)
    if (!electronHeader) throw new BadRequestException('Missing X-Wait-On header')
  }

  @Get('current')
  @ApiOperation({ description: 'NC Current Dir 조회', operationId: 'getCurrentDir' })
  @ApiQuery({ name: 'machine_id' })
  @ApiResponse({ type: CurrentDirResponseBody })
  async getCurrentDir(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string
  ): Promise<CurrentDirResponseBody> {
    this.logger.log(`[getCurrentDir] Headers: ${electronHeader}, machineId: ${machineId}`)

    // TEST용 DATA
    // if (handle == 1) return this.programTestService.getCurrentDir()
    return this.programService.getCurrentDir(machineId)
  }

  @Post('current')
  @ApiOperation({ description: 'NC CurrentDir 설정', operationId: 'setCurrentDir' })
  @ApiQuery({ name: 'machine_id' })
  @ApiQuery({ name: 'path' })
  setCurrentDir(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string,
    @Query('path') path: string
  ): Promise<void> {
    this.logger.log(`[setCurrentDir] Headers: ${electronHeader}, machineId: ${machineId}`)
    return this.programService.setCurrentDir(machineId, path)
  }

  @Get('dir/all')
  @ApiOperation({ description: '파일 및 폴더 리스트 조회', operationId: 'getAllProgramDir' })
  @ApiQuery({ name: 'machine_id' })
  @ApiQuery({ name: 'path' })
  @ApiResponse({ type: FileListResponseBody })
  async getAllProgramDir(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string,
    @Query('path') path: string
  ): Promise<FileListResponseBody> {
    this.logger.log(`[getAllProgramDir] Headers: ${electronHeader}`)

    // TEST용 DATA
    // if (handle == 1) return this.programTestService.getAllProgramDir()
    return this.programService.getAllProgramDir(machineId, path)
  }

  @Get('readPrgOfCnc')
  @ApiOperation({ description: 'NC프로그램 내용 조회', operationId: 'readPrgOfCnc' })
  @ApiQuery({ name: 'machine_id' })
  @ApiQuery({ name: 'src_prg' })
  @ApiResponse({ type: PrgOfCncResponseBody })
  async readPrgOfCnc(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string,
    @Query('src_prg') srcPrg: string,
  ): Promise<PrgOfCncResponseBody> {
    this.logger.log(`[transferPrgToCnc] Headers: ${electronHeader}`)

    // TEST용 DATA
    // if (handle == 1) return this.programTestService.getReadPrgOfCnc(machineId, srcPrg)
    return this.programService.readPrgOfCnc(machineId, srcPrg)
  }

  @Post('transferPrgToPc')
  @ApiOperation({ description: 'NC프로그램 다운로드(CNC -> PC)', operationId: 'transferPrgToPc' })
  @ApiBody({ type: TransferRequestBody })
  @ApiResponse({ type: TransferResponseBody })
  async transferPrgToPc(
    @Headers('X-Electron') electronHeader: string,
    @Body() body: TransferRequestBody
  ): Promise<TransferResponseBody> {
    this.logger.log(`[transferPrgToPc] Headers: ${electronHeader}`)
    return this.programService.transferPrgListToPc(body)
  }

  @Post('transferPrgToCnc')
  @ApiOperation({ description: 'NC프로그램 업로드(PC -> CNC)', operationId: 'transferPrgToCnc' })
  @ApiBody({ type: TransferRequestBody })
  @ApiResponse({ type: TransferResponseBody })
  async transferPrgToCnc(
    @Headers('X-Electron') electronHeader: string,
    @Body() body: TransferRequestBody
  ): Promise<TransferResponseBody> {
    this.logger.log(`[transferPrgToCnc] Headers: ${electronHeader}`)
    return this.programService.transferPrgListToCnc(body)
  }

  @Delete('deletePrgOfCnc')
  @ApiOperation({ description: 'NC프로그램 삭제', operationId: 'DeletePrgOfCnc' })
  @ApiBody({ type: DeleteRequestBody })
  @ApiResponse({ type: DeleteResponseBody })
  async DeletePrgOfCnc(
    @Headers('X-Electron') electronHeader: string,
    @Body() body: DeleteRequestBody
  ): Promise<DeleteResponseBody> {
    this.logger.log(`[DeletePrgOfCnc] Headers: ${electronHeader}, prg_src:${body.deleteRequest}`)
    return this.programService.deletePrgListOfCnc(body)
  }

  @Post('mkdir')
  @ApiOperation({ description: 'NC 폴더 생성', operationId: 'CreateFolderOfCnc' })
  @ApiQuery({ name: 'machine_id' })
  @ApiQuery({ name: 'folder_src' })
  async CreateFolderOfCnc(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string,
    @Query('folder_src') folderSrc: string
  ): Promise<void> {
    this.logger.log(`[CreateFolderOfCnc] Headers: ${electronHeader}`)
    return this.programService.createFolderOfCnc(machineId, folderSrc)
  }

  @Delete('deleteFolderOfCnc')
  @ApiOperation({ description: 'NC 폴더 삭제', operationId: 'DeleteFolderOfCnc' })
  @ApiBody({ type: DeleteRequestBody })
  @ApiResponse({ type: DeleteResponseBody })
  async DeleteFolderOfCnc(
    @Headers('X-Electron') electronHeader: string,
    @Body() body: DeleteRequestBody
  ): Promise<DeleteResponseBody> {
    this.logger.log(`[DeleteFolderOfCnc] Headers: ${electronHeader}`)
    return this.programService.deleteFolderListOfCnc(body)
  }

  @Get('readSelectedPrgOfCnc')
  @ApiOperation({ description: '', operationId: 'readSelectedPrgOfCnc' })
  @ApiQuery({ name: 'machine_id' })
  @ApiResponse({ type: PrgOfCncSelectedResponseBody })
  async readSelectedPrgOfCnc(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string
  ): Promise<PrgOfCncSelectedResponseBody> {
    this.logger.log(`[readSelectedPrgOfCnc] Headers: ${electronHeader}`)
    return this.programService.readSelectedPrgOfCnc(machineId)
  }

  @Get('searchSpecificPrg')
  @ApiOperation({ description: '', operationId: 'searchSpecificPrg' })
  @ApiQuery({ name: 'machine_id' })
  @ApiQuery({ name: 'prgnumber' })
  @ApiResponse({ type: BaseResponseBody })
  async searchSpecificPrg(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string,
    @Query('prgnumber') prgnumber: number,
  ): Promise<BaseResponseBody> {
    this.logger.log(`[searchSpecificPrg] prgnumber : ${prgnumber}, Headers: ${electronHeader}`)
    return this.programService.searchSpecificPrg(machineId, prgnumber)
  }


  @Get('history')
  @ApiOperation({ description: 'NC프로그램 업로드 History 조회', operationId: 'getHistoryList' })
  @ApiQuery({ name: 'machine_id', default: 'd709b3a2-4175-4e4a-9ca2-95cedb5eaffc', description: '장비 고유값(uuid 또는 number)' })
  @ApiQuery({ name: 'prg_src', default: '//CNC_MEM/USER/PATH1/O0001', description: 'CNC 에 저장되어있는 프로그램(경로 포함)' })
  @ApiResponse({ type: HistoryListResponseBody })
  async getHistoryList(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string,
    @Query('prg_src') prgSrc: string
  ): Promise<HistoryListResponseBody> {
    this.logger.log(`[getHistoryList] Machine UUID: ${machineId}, Headers: ${electronHeader}`)
    return this.programService.getHistoryList(machineId, prgSrc)
  }

  @Get('history/diff')
  @ApiOperation({ description: 'NC프로그램 업로드 Diff 정보 조회', operationId: 'getProgramDiffInfo' })
  @ApiQuery({ name: 'machine_id', default: 'd709b3a2-4175-4e4a-9ca2-95cedb5eaffc', description: '장비 고유값(uuid 또는 number)' })
  @ApiQuery({ name: 'uuid', default: 'd709b3a2-4175-4e4a-9ca2-95cedb5eaffc', description: 'history uuid' })
  @ApiQuery({ name: 'prg_src', default: '//CNC_MEM/USER/PATH1/O0001', description: 'CNC 에 저장되어있는 프로그램(경로 포함)' })
  @ApiResponse({ type: ProgramDiffInfo })
  async getProgramDiffInfo(
    @Headers('X-Electron') electronHeader: string,
    @Query('machine_id') machineId: string,
    @Query('uuid') uuid: string,
    @Query('prg_src') prgSrc: string,
  ): Promise<ProgramDiffInfo> {
    this.logger.log(`[getProgramDiffInfo] Machine UUID: ${machineId}, Headers: ${electronHeader}`)
    return this.programService.getProgramDiffInfo(machineId, prgSrc, uuid)
  }
}
