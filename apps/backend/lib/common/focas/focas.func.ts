import { app } from 'electron'
import * as path from 'path'
import koffi from 'koffi'

// Program 관련 VO 타입 임포트 (예시)
// 실제 VO 파일 경로에 맞게 수정해야 합니다.
// import { ProgramVO } from '@/backend/program/vo/program.vo' // 예시 경로

// AxisSpindle 관련 VO 타입 임포트 (주석 처리되어 있지만 필요시 사용)
// import { AxisSpindleVO } from '@/backend/axis-spindle/vo/axis_spindle.vo'

// Others 관련 VO 타입 임포트 (주석 처리되어 있지만 필요시 사용)
// import { OthersVO } from '@/backend/others/vo/others.vo'

const appPath = app.getAppPath()

// OS에 따라 로드할 FOCAS 라이브러리 파일 경로를 반환하는 함수
const getLibraryPath = (): string => {
  let libraryPath: string
  if (process.platform === 'win32') {
    // Windows 환경에서는 fwlibe64.dll 사용
    libraryPath = 'fwlibe64.dll' // Windows DLL 파일 이름
  } else if (process.platform === 'linux') {
    console.log('Detected platform: linux') // 디버깅용 로그
    // Linux 환경에서는 libfwlib32-linux-x64.so.1.0.5 사용
    libraryPath = 'libfwlib32-linux-x64.so.1.0.5' // Linux SO 파일 이름
  } else if (process.platform === 'darwin') {
    // Mac OS일 경우 test 파일 사용
    libraryPath = 'fwlibe64.dylib'
  } else {
    // 지원하지 않는 OS일 경우 에러 발생
    throw new Error(`Unsupported platform: ${process.platform}`)
  }
  // 라이브러리 파일이 'focas' 디렉토리 안에 있다고 가정하고 경로 반환
  return libraryPath
}


// FOCAS 라이브러리 함수들을 관리하는 클래스
export class FOCAS {

  // Static 속성 선언
  // FWLIB: 로드할 FOCAS 라이브러리 파일의 전체 경로
  static FWLIB: string

  // ffi.Library 호출 결과를 할당할 static 속성 선언
  // 로드된 FOCAS 함수 객체를 저장합니다.
  // 타입스크립트 컴파일 오류를 회피하기 위해 any 타입 사용
  static func: any // 또는 FocasWinFunctions | FocasLinuxFunctions; (타입 명시 시)


  // 클래스 로딩 시점에 한 번 실행되는 Static 초기화 블록
  // 이 블록 내에서 ffi.Library를 호출하고 static func를 초기화합니다.
  static {
    // FWLIB static 속성 초기화
    // 'focas/' 디렉토리와 OS별 라이브러리 파일 이름을 결합하여 경로 생성
    this.FWLIB = getLibraryPath()
    const lib = koffi.load(process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '..', 'src', 'backend', 'focas', this.FWLIB)
      : path.join(appPath, 'dist', 'backend', 'focas', this.FWLIB).replace('app.asar', 'app.asar.unpacked'))
    /*
     ProgramVO
     */
    const IDBPDFADIR = koffi.struct('IDBPDFADIR', {
      path: 'char[212]',
      req_num: 'short',
      size_kind: 'short',
      type: 'short',
      dummy: 'short'
    })
    const IDBPDFSDIR = koffi.struct('IDBPDFSDIR', {
      path: 'char[212]',
      req_num: 'short',
      dummy: 'short'
    })
    const ODBPDFADIR = koffi.struct('ODBPDFADIR', {
      data_kind: 'short',
      year: 'short',
      mon: 'short',
      day: 'short',
      hour: 'short',
      min: 'short',
      sec: 'short',
      dummy: 'short',
      dummy2: 'long',
      size: 'long',
      attr: 'ulong',
      d_f: 'char[36]',
      comment: 'char[52]',
      o_time: 'char[12]'
    })
    const ODBPDFSDIR = koffi.struct('ODBPDFSDIR', {
      sub_exist: 'short',
      dummy: 'short',
      d_f: 'char[36]'
    })

    const ODBPRO  = koffi.struct('ODBPRO',{
      dummy: 'short',
      data:'short',
      mdata:'short'
    })


    /*
     AxisSpindleVO
     */
    const LOADELM = koffi.struct('LOADELM', {
      data: 'long',
      dec: 'short',
      unit: 'short',
      name: 'char',
      suff1: 'char',
      suff2: 'char',
      reserve: 'char'
    })
    const ODBSPLOAD = koffi.struct('ODBSPLOAD', {
      spload: 'LOADELM',
      spspeed: 'LOADELM'
    })

    /*
     OthersVO
     */
    const ODBSYS = koffi.struct('ODBSYS', {
      addinfo: 'short',
      max_axis: 'short',
      cnc_type: 'char[2]',
      mt_type: 'char[2]',
      series: 'char[4]',
      version: 'char[4]',
      axes: 'char[2]'
    })

    // OS에 관계없이 공통으로 포함되는 FOCAS 함수 정의들을 담을 객체
    // 각 함수 정의는 [반환 타입, [매개변수 타입 배열]] 형태의 튜플입니다.
    const commonFocasFuncs = {

      // // //handle, node 관련 함수
      // 함수 (주석 처리되어 있으므로 필요시 주석 해제)
      cnc_exitprocess: process.platform === 'linux' ? lib.func('short cnc_exitthread()') : () => {},

      // 핸들 취득 함수
      // cnc_allclibhndl3: lib.func('cnc_allclibhndl3', 'short', ['char *', 'unsigned short', 'long', koffi.out('unsigned short *')]),
      cnc_allclibhndl3: lib.func('short cnc_allclibhndl3( const char *, unsigned short, long, _Out_ unsigned short * )'),

      // cnc_freelibhndl: 핸들 해제 함수
      cnc_freelibhndl: lib.func('short cnc_freelibhndl( unsigned short )'),


      // //axis spindle 관련 함수 (주석 처리)
      // 스핀들 정보 읽기 함수 (예시)
      cnc_rdspmeter: lib.func('short cnc_rdspmeter( unsigned short, short, _Inout_ short *, _Out_ ODBSPLOAD * )'),


      // //cnc program 관련 함수
      // 메인 프로그램 읽기 함수
      cnc_pdf_rdmain: lib.func('short cnc_pdf_rdmain( unsigned short, _Out_ char * )'),

      // 현재 디렉토리 프로그램 목록 읽기 함수
      cnc_rdpdf_curdir: lib.func('short cnc_rdpdf_curdir( unsigned short, short, _Out_ char * )'),

      // 모든 디렉토리 프로그램 목록 읽기 함수
      cnc_rdpdf_alldir: lib.func('cnc_rdpdf_alldir', 'short', ['unsigned short', koffi.inout('short *'), IDBPDFADIR, koffi.out('ODBPDFADIR *')]),

      // 현재 디렉토리 프로그램 쓰기 함수
      cnc_wrpdf_curdir: lib.func('short cnc_wrpdf_curdir( unsigned short, short, char * )'),

      // 하위 디렉토리 프로그램 목록 읽기 함수
      cnc_rdpdf_subdir: lib.func('short cnc_rdpdf_subdir( unsigned short, _Inout_ short *, IDBPDFSDIR *, _Out_ ODBPDFSDIR * )'),

      // cnc_upstart4: 프로그램 업로드 시작 함수
      cnc_upstart4: lib.func('short cnc_upstart4( unsigned short, short, char * )'),

      // cnc_upload4: 프로그램 업로드 데이터 전송 함수
      cnc_upload4: lib.func('short cnc_upload4( unsigned short, _Inout_ long *, _Out_ char * )'),

      // cnc_upend4: 프로그램 업로드 종료 함수
      cnc_upend4: lib.func('short cnc_upend4( unsigned short )'),

      // cnc_download4: 프로그램 다운로드 데이터 수신 함수
      cnc_download4: lib.func('short cnc_download4( unsigned short, _Inout_ long *, char * )'),

      // 프로그램 다운로드 시작 함수
      cnc_dwnstart4: lib.func('short cnc_dwnstart4( unsigned short, short, char * )'), // "short", "ushort", "string" 문자열 별칭 사용. string 대신 Buffer 타입을 사용해야 할 수 있습니다.

      // 프로그램 다운로드 종료 함수
      cnc_dwnend4: lib.func('short cnc_dwnend4( unsigned short )'),

      // cnc_delete: 프로그램 삭제 함수 (주석 처리)
      cnc_delete: lib.func('short cnc_delete( unsigned short, short )'),

      // 프로그램 삭제 함수
      cnc_pdf_del: lib.func('short cnc_pdf_del( unsigned short, char * )'),

      cnc_pdf_add: lib.func('short cnc_pdf_add( unsigned short, char * )'),

      //선택된 프로그램 이름 읽어오는 함수
      cnc_rdprgnum: lib.func('short cnc_rdprgnum( unsigned short, ODBPRO * ) '),


      //프로그램 검색하는 함수
      cnc_search: lib.func('short cnc_search( unsigned short, short )')
      // //others 관련 함수 (주석 처리)
      // 시스템 정보 읽기 함수 (예시)
      // cnc_sysinfo: lib.func('short cnc_sysinfo( unsigned short, _Out_ ODBSYS * )')
    }

    // OS별로 다르게 포함될 함수 정의를 담을 객체
    // Linux 환경에서만 cnc_startupprocess 함수 정의를 추가합니다.
    const osSpecificFocasFuncs: { [key: string]: any } = {} // 타입스크립트 오류 회피를 위해 any 사용

    // process.platform이 'linux'인 경우에만 cnc_startupprocess 함수 정의 추가
    if (process.platform === 'linux') {
      // cnc_startupprocess: CNC 연결 시작 함수 (Linux 전용)
      // osSpecificFocasFuncs.cnc_startupprocess = [Types.short, [Types.long, Types.charPtr]] // Types.long, Types.charPtr 타입 사용
    }

    // 공통 함수 정의 객체와 OS별 함수 정의 객체를 합쳐 최종 함수 정의 객체 생성
    this.func = {
      ...commonFocasFuncs, // 공통 함수들 복사
      ...osSpecificFocasFuncs // OS별 함수들 복사 (Linux에서는 cnc_startupprocess가 추가됨)
    }
  }

  // Static 초기화 블록을 사용하므로 별도의 initialize 함수 호출은 필요 없을 수 있습니다.
  // 만약 initialize 함수를 사용하려면, 위 Static 블록 내용을 initialize 함수 안으로 옮깁니다.
  // static initialize() {
  //   // ... (Static 블록 내용 복사)
  // }
}

// Static 초기화 블록 사용 시, FOCAS 클래스가 로딩되는 시점에 블록 내부 코드가 실행됩니다.
// 따라서 main.ts 등에서 FOCAS 클래스를 임포트하기만 하면 초기화가 자동으로 이루어집니다.
// 명시적으로 초기화를 관리하고 싶다면 Static 초기화 함수 initialize()를 사용하고 main.ts에서 호출합니다.

