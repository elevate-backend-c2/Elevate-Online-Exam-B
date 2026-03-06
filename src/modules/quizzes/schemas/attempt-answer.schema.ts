import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttemptAnswerDocument = HydratedDocument<AttemptAnswer>;

@Schema({
  timestamps: true,
})
export class AttemptAnswer {
  @Prop({ type: Types.ObjectId, ref: 'ExamAttempt', required: true })
  attemptId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  selectedOptions: string[];

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ default: 0 })
  pointsAwarded: number;
}

export const AttemptAnswerSchema = SchemaFactory.createForClass(AttemptAnswer);

