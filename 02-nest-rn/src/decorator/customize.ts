import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const IS_ADMIN_KEY = 'isAdmin'
export const Admin = () => SetMetadata(IS_ADMIN_KEY, true)
export const RESPONSE_MESSAGE = 'response_Message'
export const ResponseMessage = (message: string) =>
    SetMetadata(RESPONSE_MESSAGE, message)