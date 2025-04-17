import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { hashPasswordHelper } from '@/helpers/util'
export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string

  @Prop()
  email: string

  @Prop()
  password: string

  @Prop()
  phone: string

  @Prop()
  address: string

  @Prop()
  image: string

  @Prop({ default: 'USER' })
  role: string

  @Prop({ default: 'LOCAL' })
  accountType: string

  @Prop({ default: false })
  isActive: boolean

  @Prop()
  codeId: string

  @Prop()
  codeExpired: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const hashPassword = await hashPasswordHelper(this.password)
  this.password = hashPassword
  next()
})
