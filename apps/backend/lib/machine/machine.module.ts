import { Module } from '@nestjs/common'

import { MachineController } from './machine.controller'
import { MachineService } from './machine.service'
import { MachineRepository } from './repository/machine.repository'

@Module({
  imports: [],
  controllers: [MachineController],
  providers: [
    MachineService,
    MachineRepository
  ],
  exports: [MachineService],
})
export class MachineModule { }
