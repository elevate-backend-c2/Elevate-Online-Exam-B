import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ExamAttemptStatus } from '../enums/exam-attempt-status.enum';

export type ExamAttemptDocument = HydratedDocument<ExamAttempt>;

@Schema({
  timestamps: true,
})
export class ExamAttempt {
  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quizId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: ExamAttemptStatus, default: ExamAttemptStatus.IN_PROGRESS })
  status: ExamAttemptStatus;

  @Prop({ default: 0 })
  score: number;

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  durationSeconds?: number;
}

export const ExamAttemptSchema = SchemaFactory.createForClass(ExamAttempt);

