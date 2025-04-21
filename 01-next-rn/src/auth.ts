import { IUser } from '@/types/next-auth'
import { sendRequest } from '@/utils/api'
import { InActiveAccountError, InvalidEmailPasswordError } from '@/utils/error'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: 'POST',
          url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
          body: {
            username: credentials?.email,
            password: credentials?.password,
          },
        })

        if (res.statusCode === 201) {
          // user
          return {
            _id: res.data?.user._id,
            name: res.data?.user.name,
            email: res.data?.user.email,
            access_token: res.data?.access_token,
          }
        } else if (+res.statusCode === 400) {
          throw new InvalidEmailPasswordError()
        } else if (+res.statusCode == 401) {
          throw new InActiveAccountError()
        } else {
          throw new Error('Internal Server Error')
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    jwt({ token, user }) {

      // token auto created by next-auth, token auto create new field email, 
      // user created by authorize function in provider

      if (user) {
        // User is available during sign-in
        token.user = user as IUser
      }
      return token
    },
    session({ session, token }) {
      (session.user as IUser) = token.user

      return session
    },
    authorized: async ({ auth }) => {
      return !!auth
    }

  },
  // cookies: {
  //   sessionToken: {
  //     name: "authjs.session-tokennn", // Tùy chỉnh tên cookie
  //     options: {
  //       httpOnly: true, // Cookie không thể truy cập từ JavaScript
  //       secure: process.env.NODE_ENV === "production", // Chỉ sử dụng cookie qua HTTPS khi ở môi trường production
  //       sameSite: "lax", // Cấu hình chính sách SameSite
  //       path: "/",
  //     },
  //   },
  // },
})
