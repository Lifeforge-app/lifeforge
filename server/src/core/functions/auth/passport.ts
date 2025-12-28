import passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import PocketBase from 'pocketbase'

import type { JWTPayload } from './jwt'

const getSecret = (): string => {
  const secret = process.env.MASTER_KEY

  if (!secret) {
    throw new Error('MASTER_KEY environment variable is required')
  }

  return secret
}

export function configurePassport(): void {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: getSecret()
      },
      async (payload: JWTPayload, done) => {
        try {
          done(null, payload)
        } catch (error) {
          done(error, false)
        }
      }
    )
  )

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const pb = new PocketBase(process.env.PB_HOST)

          await pb.collection('users').authWithPassword(email, password)

          if (pb.authStore.isValid && pb.authStore.record) {
            const user = pb.authStore.record

            done(null, {
              userId: user.id,
              email: user.email,
              username: user.username,
              twoFAEnabled: Boolean(user.twoFASecret),
              record: user
            })
          } else {
            done(null, false, { message: 'Invalid credentials' })
          }
        } catch {
          done(null, false, { message: 'Invalid credentials' })
        }
      }
    )
  )
}

export { passport }
