import { ApiProperty } from "@nestjs/swagger"

export class BaseResponseBody {
  @ApiProperty({ default: 0 })
  result: number
}

export class CommonFunc {
  static ascToString(aci: Buffer) {
    return String.fromCharCode.apply(null, aci.toString('utf-8').split(','))
  }
  static getOSPlatform(){
    
    const platform = process.platform;
    const isWindows = platform === 'win32';
    const isLinux = platform === 'linux';
    const isMac = platform === 'darwin';

    return {
      platform: platform,
      isWindows: isWindows,
      isLinux: isLinux,
      isMac: isMac
    };
  }

}

