import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUtilsService } from './utils/auth-utils.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  PasswordReset,
  PasswordResetSchema,
} from './schemas/password-reset.schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { DiplomaAccessGuard } from './guards/diploma-access.guard';
import { Quiz, QuizSchema } from '../quizzes/schemas/quiz.schema';
import { Topic, TopicSchema } from '../topics/schemas/topic.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES') as any,
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: PasswordReset.name, schema: PasswordResetSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Topic.name, schema: TopicSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthUtilsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    DiplomaAccessGuard,
  ],
})
export class AuthModule {}
