import { ApiProperty } from '@nestjs/swagger'


export class UserDTO {
  @ApiProperty({ default: 'jap9u' })
  userId: string
  roleId: number
  companyId: string
  plantId: string
  name: string
  phone: string
  password: string
  createdAt: Date
}



