import { FileTransferProtocol, MachineType } from "../enum/machine.enum"

export class MachineEntity {
  machineType: MachineType
  machineId: string
  name: string
  ip: string
  port: number
  fileTransferProtocol: FileTransferProtocol
  fileTransferId: string              // FOCAS 인 경우에는 필요 없음. 지멘스(SMB, SFTP) 만 필요
  fileTransferPw: string              // FOCAS 인 경우에는 필요 없음. 지멘스(SMB, SFTP) 만 필요
}
