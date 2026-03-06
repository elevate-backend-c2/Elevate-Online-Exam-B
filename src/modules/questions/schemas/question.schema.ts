import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
}

@Schema({
  timestamps: true,
})
export class Question {
  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quizId: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ enum: QuestionType, default: QuestionType.SINGLE_CHOICE })
  type: QuestionType;

  @Prop({ type: [String], default: [] })
  options: string[];

  @Prop({ type: [String], default: [] })
  correctAnswers: string[];

  @Prop()
  explanation?: string;

  @Prop({ default: 1 })
  order: number;

  @Prop({ default: 1 })
  points: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

