import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export enum SuperAdminAction {
  CREATE_ADMIN = 'CREATE_ADMIN',
  DEACTIVATE_ADMIN = 'DEACTIVATE_ADMIN',
  UPDATE_ADMIN_PERMISSIONS = 'UPDATE_ADMIN_PERMISSIONS',
}

@Schema({ timestamps: true })
export class SuperAdminAuditLog {
  @Prop({ enum: SuperAdminAction })
  action: SuperAdminAction;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  performedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  targetId: Types.ObjectId;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const SuperAdminAuditLogSchema =
  SchemaFactory.createForClass(SuperAdminAuditLog);
