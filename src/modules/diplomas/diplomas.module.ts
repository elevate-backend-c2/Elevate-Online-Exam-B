import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiplomasController } from './diplomas.controller';
import { DiplomasService } from './diplomas.service';
import { Diploma, DiplomaSchema } from './schemas/diploma.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Diploma.name, schema: DiplomaSchema }])],
  controllers: [DiplomasController],
  providers: [DiplomasService],
  exports: [MongooseModule],
})
export class DiplomasModule {}
