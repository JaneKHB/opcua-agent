import { Controller, Post, Get, Body } from '@nestjs/common'
import { ApiBody, ApiTags, ApiOperation, } from '@nestjs/swagger'
import { LicenseService } from './license.service'
import { LicenseDTO, HardwawreInfoDTO, RegisterLicenseRequestBody } from './dto/license.dto'

@ApiTags('license')
@Controller('license')
export class LicenseController {

    constructor(private readonly licenseService: LicenseService) { }

    @Get('')
    @ApiOperation({ description: '라이선스 정보 확인', operationId: 'getLicenseInfo' })
    async getLicenseInfo(): Promise<LicenseDTO> {
        return this.licenseService.getLicenseInfo()
    }

    @Post('offline')
    @ApiOperation({ description: 'Offline 라이선스 정보 등록', operationId: 'registerLicenseOffline' })
    @ApiBody({ type: RegisterLicenseRequestBody })
    async registerLicenseOffline(@Body() body: RegisterLicenseRequestBody): Promise<void> {
        return this.licenseService.registerLicenseOffline(body)
    }

    @Post('online')
    @ApiOperation({ description: 'Online(RMS) 라이선스 정보 등록', operationId: 'registerLicenseOnline' })
    @ApiBody({ type: RegisterLicenseRequestBody })
    async registerLicenseOnline(@Body() body: RegisterLicenseRequestBody): Promise<void> {
        return this.licenseService.registerLicenseOnline(body)
    }

    @Get('hardware')
    @ApiOperation({ description: 'PC 고유값 확인(uuid, serial number)', operationId: 'getUuidFromPC' })
    async getHardwareInfo(): Promise<HardwawreInfoDTO> {
        return this.licenseService.getHardwareInfo()
    }

    // TODO. 테스트를 위한 라이센스키 획득 API(Offline 버전). 테스트 후, API 삭제 예정
    @Get('my-license-key')
    @ApiOperation({ description: '본인 PC 의 Offline 라이센스키 획득(테스트 용도)', operationId: 'getMyLicenseKey' })
    async getMyLicenseKey(): Promise<HardwawreInfoDTO> {
        return this.licenseService.getMyLicenseKey()
    }



}
