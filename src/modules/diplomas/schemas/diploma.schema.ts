import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DiplomaDocument = HydratedDocument<Diploma>;

@Schema({
  timestamps: true,
})
export class Diploma {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  issuedAt: Date;

  @Prop()
  image?: string;
}

export const DiplomaSchema = SchemaFactory.createForClass(Diploma);
