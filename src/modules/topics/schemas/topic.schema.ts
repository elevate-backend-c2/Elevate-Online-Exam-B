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

  @Prop()
  image?: string;

  @Prop({ type: Types.ObjectId, ref: 'Topic', default: null })
  parentTopicId?: Types.ObjectId | null;

  @Prop({ default: true })
  isPublished: boolean;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);

