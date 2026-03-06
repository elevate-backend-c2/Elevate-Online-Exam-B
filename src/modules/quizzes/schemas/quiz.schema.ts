import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { QuizDifficulty } from '../enums/quiz-difficulty.enum';
import { AllowedQuizDifficultyConfig } from '../interfaces/allowed-difficulty.interface';

export type QuizDocument = HydratedDocument<Quiz>;

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

  @Prop({
    type: [
      {
        difficulty: { type: String, enum: QuizDifficulty, required: true },
        points: { type: Number, required: true },
        numberOfQuestions: { type: Number, required: true },
      },
    ],
    default: [],
  })
  allowedQuizDifficulties: AllowedQuizDifficultyConfig[];

  @Prop({ required: true })
  passPercentage: number;

  @Prop({ required: true })
  durationMinutes: number;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

