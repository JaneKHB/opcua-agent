import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston'
import * as winston from 'winston'
import { ProgramModule } from './program/program.module'
import { LicenseModule } from './license/license.module'
import { MachineModule } from './machine/machine.module'

@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('focas-api', {
              colors: process.env.NODE_ENV != 'production',
              prettyPrint: process.env.NODE_ENV != 'production',
            })
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ProgramModule,
    LicenseModule,
    MachineModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
