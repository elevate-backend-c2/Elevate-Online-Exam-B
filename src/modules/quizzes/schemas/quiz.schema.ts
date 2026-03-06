import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

export enum QuizDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Schema({
  timestamps: true,
})
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop({ type: Types.ObjectId, ref: 'Topic', required: true })
  topicId: Types.ObjectId;

  @Prop({ enum: QuizDifficulty, default: QuizDifficulty.MEDIUM })
  difficulty: QuizDifficulty;

  @Prop({ required: true })
  durationMinutes: number;

  @Prop({ required: true })
  totalMarks: number;

  @Prop({ required: true })
  passMarks: number;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

