import { Injectable } from '@nestjs/common'
import { MachineEntity } from '../repository/machine.entity'
import { FileBaseRepository } from '../../common/repository/file-base.repository';

@Injectable()
export class MachineRepository extends FileBaseRepository<MachineEntity> {

  protected getFileName(): string {
    return 'machine_list.json';
  }

  protected getId(item: MachineEntity): string {
    return item.machineId;
  }
}