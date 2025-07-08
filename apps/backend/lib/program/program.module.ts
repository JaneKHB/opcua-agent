import { Module } from '@nestjs/common'

import { ProgramController } from './program.controller'
import { ProgramService } from './program.service'
import { ProgramTestService } from './program-test.service'
import { ProgramHistoryRepository } from './repository/program-history.repository'
import { MachineRepository } from '../machine/repository/machine.repository'

@Module({
  imports: [],
  controllers: [ProgramController],
  providers: [
    ProgramService, 
    ProgramTestService,
    MachineRepository,
    ProgramHistoryRepository
  ],
  exports: [ProgramService, ProgramTestService],
})
export class ProgramModule {}
