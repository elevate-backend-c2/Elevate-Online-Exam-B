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
    validate: {
      validator: (levels: AllowedQuizDifficultyConfig[]) =>
        Array.isArray(levels) &&
        levels.every((level) => {
          if (
            typeof level?.numberOfQuestions !== 'number' ||
            typeof level?.points !== 'number'
          ) {
            return false;
          }
          const minPoints = level.numberOfQuestions;
          const maxPoints = level.numberOfQuestions * 3;
          return level.points >= minPoints && level.points <= maxPoints;
        }),
      message:
        'For each difficulty level, points must be between numberOfQuestions and 3 * numberOfQuestions because each question is worth between 1 and 3 points.',
    },
  })
  allowedQuizDifficulties: AllowedQuizDifficultyConfig[];

  @Prop({ required: true })
  passPercentage: number;
  @Prop({ type: Types.ObjectId, ref: 'Diploma', required: true })
  diplomaId: Types.ObjectId;

  @Prop({ enum: QuizDifficulty, default: QuizDifficulty.MEDIUM })
  difficulty: QuizDifficulty;

  @Prop({ required: true })
  durationMinutes: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
