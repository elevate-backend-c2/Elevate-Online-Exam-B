import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiplomasController } from './diplomas.controller';
import { DiplomasService } from './diplomas.service';
import { Diploma, DiplomaSchema } from './schemas/diploma.schema';
import { DiplomasAdminController } from 'src/modules/diplomas/diplomas-admin.controller';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { QuizzesModule } from 'src/modules/quizzes/quizzes.module';
import {
  Enrollment,
  EnrollmentSchema,
} from 'src/modules/diplomas/schemas/enrollment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diploma.name, schema: DiplomaSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
    PaginationModule,
    QuizzesModule,
  ],
  controllers: [DiplomasController, DiplomasAdminController],
  providers: [DiplomasService],
  exports: [MongooseModule],
})
export class DiplomasModule {}
