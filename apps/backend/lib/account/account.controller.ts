import { Controller, Headers, Post, Logger, Query, Get, Body, Res, StreamableFile } from '@nestjs/common'
import { ApiQuery, ApiBody, ApiTags, ApiOperation, } from '@nestjs/swagger'

import { AccountService } from './account.service'

@ApiTags('account')
@Controller('account')
export class AccountController {

    constructor(private readonly accountService: AccountService) { }
    //TODO 계정 만들기 구현 

}
