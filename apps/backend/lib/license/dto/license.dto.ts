import { ApiProperty } from '@nestjs/swagger'

export class HardwawreInfoDTO {
    @ApiProperty({ default: '24DFAED6-CDAB-17DD-8516-630AA7CC35E3', description: 'PC UUID 값' })
    uuid: string

    @ApiProperty({ default: '305NZAU059808', description: 'PC Serial Number 값' })
    serialNumber: string
}

export class LicenseDTO {
    @ApiProperty({ default: true, description: '라이선스 파일 존재 여부' })
    hasLicenseFile: boolean

    @ApiProperty({ default: new Date('2025-12-01'), description: '유효기간' })
    expirationPeriod: Date

    @ApiProperty({ default: true, description: '영구 라이선스 여부' })
    permanent: boolean
}

export class RegisterLicenseRequestBody {
    @ApiProperty({ default: '9Q7gSQ2jkKTznRKU2qgoDD8BBBoQ1n4UqZOlBYkqpa16tfSx45z95TObFgOmhUvDfDCzoNEswELLutr6/YJIauEBOd0D7fkX2KzQBhMXSOyiEVFu9MBbE5z9nnmnKUQe5erKE4VwAp22H3P2E1T0xfCSGz68R9eIcfA/QfGSeTpw+IrvdlGcb7Qu2RB40NVS' })
    licenseKey: string
}