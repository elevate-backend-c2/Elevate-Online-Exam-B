import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CertificateDocument = HydratedDocument<Certificate>;

@Schema({
  timestamps: true,
})
export class Certificate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quizId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  certificateCode: string;

  @Prop({ required: true })
  issuedAt: Date;

  @Prop()
  expiresAt?: Date;

  @Prop()
  pdfUrl?: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);

