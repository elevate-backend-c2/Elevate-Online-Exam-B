import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({
  timestamps: true,
})
export class Admin {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  role: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
