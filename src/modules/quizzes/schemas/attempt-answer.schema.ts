import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  _id: false,
})
export class AttemptAnswerSubdocument {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  selectedOptions: string[];

  @Prop({ type: Boolean, default: false })
  isCorrect: boolean;

  @Prop({ type: Number, default: 0 })
  pointsAwarded: number;
}

export const AttemptAnswerSchema =
  SchemaFactory.createForClass(AttemptAnswerSubdocument);
