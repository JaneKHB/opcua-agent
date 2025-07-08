export class ProgramHistoryEntity {
    uuid: string                // 커밋 구분 uuid
    machineId: string           // 장비 ID.
    datetime: string            // 날짜 시간
    userId: string              // 로그인 유저 ID
    srcPrg: string              // 프로그램 경로
    oldProgramContent: string   // 프로그램을 업로드 하기 전 해당 프로그램의 내용
    newProgramContent: string   // 프로그램을 업로드 한 후 해당 프로그램의 내용
}