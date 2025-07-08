import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { HardwawreInfoDTO, LicenseDTO, RegisterLicenseRequestBody } from './dto/license.dto'
import si from 'systeminformation';

@Injectable()
export class LicenseService {

    // TODO. electron app 경로에 라이센스 파일 저장 예정. 
    // 파일이 없으면 등록 안된 상태. 파일이 있더라도 파일 내용 정합성 체크 및 유효기간 체크 통과해야 최종적으로 라이선스 등록된 적용된 상태로 판단.
    private readonly licenseFilePath = ''
    private readonly secretKey = ''

    async getLicenseInfo(): Promise<LicenseDTO> {
        // TODO. 실제 파일 읽어서 파일 내용 정합성 체크 및 유효기간 체크해야함.
        // 라이선스 파일이 없는 경우와 유효기간이 지난 경우는 각각 다르게 표시
        const hasLicense = true

        return {
            hasLicenseFile: hasLicense,
            expirationPeriod: new Date('2025-07-01'),
            permanent: false
        }
    }

    async registerLicenseOffline(body: RegisterLicenseRequestBody): Promise<void> {
        const receivedLicenseKey = body.licenseKey

    }

    async registerLicenseOnline(body: RegisterLicenseRequestBody): Promise<void> {
    }

    async getHardwareInfo(): Promise<HardwawreInfoDTO> {
        return {
            uuid: (await si.system()).uuid,
            serialNumber: (await si.bios()).serial || ''
        }
    }

    async getMyLicenseKey(): Promise<HardwawreInfoDTO> {
        throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    async downloadTestLicenseFile(): Promise<void> {

    }
}
