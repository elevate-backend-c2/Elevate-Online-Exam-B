import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { QuestionType } from '../enums/question-type.enum';

export type QuestionDocument = HydratedDocument<Question>;

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

  @Prop({ type: Number, enum: [1, 2, 3], default: 1 })
  difficulty: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

