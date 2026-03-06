import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'existing email'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: [Types.ObjectId], ref: 'Diploma', default: [] })
  allowedDiplomas: Types.ObjectId[];

  @Prop({ default: true })
  active: boolean;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  avatar: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

}
    
export const UserSchema = SchemaFactory.createForClass(User)