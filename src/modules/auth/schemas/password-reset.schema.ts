import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PasswordResetDocument = HydratedDocument<PasswordReset>;

@Schema({
  timestamps: true,
})
export class PasswordReset {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  verificationCode: string;

  @Prop({ required: true })
  verificationCodeExpiresAt: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordTokenExpiresAt?: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);

