import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema({
  timestamps: true,
})
export class Topic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Diploma', required: true })
  diplomaId: Types.ObjectId;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
