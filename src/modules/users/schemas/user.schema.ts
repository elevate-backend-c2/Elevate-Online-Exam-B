import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Role } from "src/modules/auth/enums/role.enum";

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

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

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