import { Injectable } from '@nestjs/common'
import { ProgramHistoryEntity } from '../repository/program-history.entity'
import { FileBaseRepository } from '../../common/repository/file-base.repository'

@Injectable()
export class ProgramHistoryRepository extends FileBaseRepository<ProgramHistoryEntity> {
    // 저장할 파일 이름
    protected getFileName(): string {
        return 'program_history.json'
    }

    // KEY 값
    protected getId(item: ProgramHistoryEntity): string {
        return item.uuid
    }
}