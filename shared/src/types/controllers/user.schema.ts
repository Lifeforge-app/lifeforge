import { z } from 'zod/v4'

import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Auth = {
  /**
   * @route       POST /validate-otp
   * @description Validate OTP
   */
  validateOtp: {
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    }),
    response: z.boolean()
  },

  /**
   * @route       GET /otp
   * @description Generate OTP
   */
  generateOtp: {
    response: z.string()
  },

  /**
   * @route       POST /login
   * @description User login
   */
  login: {
    body: z.object({
      email: z.string(),
      password: z.string()
    }),
    response: z.union([
      z.object({
        state: z.literal('2fa_required'),
        tid: z.string()
      }),
      z.object({
        state: z.literal('success'),
        session: z.string(),
        userData: z.record(z.string(), z.any())
      })
    ])
  },

  /**
   * @route       POST /verify
   * @description Verify session token
   */
  verifySessionToken: {
    response: z.object({
      session: z.string(),
      userData: z.record(z.string(), z.any())
    })
  }
}

const TwoFa = {
  /**
   * @route       GET /challenge
   * @description Get 2FA challenge
   */
  getChallenge: {
    response: z.string()
  },

  /**
   * @route       GET /otp
   * @description Request OTP for 2FA
   */
  requestOtp: {
    query: z.object({
      email: z.email()
    }),
    response: z.string()
  },

  /**
   * @route       POST /otp
   * @description Validate OTP for 2FA
   */
  validateOtp: {
    body: z.object({
      otp: z.string(),
      otpId: z.string()
    }),
    response: z.boolean()
  },

  /**
   * @route       GET /link
   * @description Generate authenticator link for 2FA
   */
  generateAuthtenticatorLink: {
    response: z.string()
  },

  /**
   * @route       POST /verify-and-enable
   * @description Verify and enable 2FA
   */
  verifyAndEnable2Fa: {
    body: z.object({
      otp: z.string()
    }),
    response: z.void()
  },

  /**
   * @route       POST /disable
   * @description Disable 2FA
   */
  disable2Fa: {
    response: z.void()
  },

  /**
   * @route       POST /verify
   * @description Verify 2FA code
   */
  verify2Fa: {
    body: z.object({
      otp: z.string(),
      tid: z.string(),
      type: z.enum(['email', 'app'])
    }),
    response: z.object({
      session: z.string(),
      userData: z.record(z.string(), z.any())
    })
  }
}

const Oauth = {
  /**
   * @route       GET /providers
   * @description List available OAuth providers
   */
  listOAuthProviders: {
    response: z.array(z.string())
  },

  /**
   * @route       GET /endpoint
   * @description Get OAuth endpoint for a provider
   */
  getOAuthEndpoint: {
    query: z.object({
      provider: z.string()
    }),
    response: z.record(z.string(), z.any())
  },

  /**
   * @route       POST /verify
   * @description Verify OAuth callback
   */
  oauthVerify: {
    body: z.object({
      provider: z.string(),
      code: z.string()
    }),
    response: z.union([
      z.string(),
      z.object({
        state: z.string(),
        tid: z.string()
      })
    ])
  }
}

const Personalization = {
  /**
   * @route       GET /fonts
   * @description List available Google Fonts
   */
  listGoogleFonts: {
    response: z.object({
      enabled: z.boolean(),
      items: z.array(z.any()).optional()
    })
  },

  /**
   * @route       GET /font
   * @description Get specific Google Font details
   */
  getGoogleFont: {
    query: z.object({
      family: z.string()
    }),
    response: z.object({
      enabled: z.boolean(),
      items: z.array(z.any()).optional()
    })
  },

  /**
   * @route       PUT /bg-image
   * @description Update background image
   */
  updateBgImage: {
    body: z.object({
      url: z.string().optional()
    }),
    response: z.string()
  },

  /**
   * @route       DELETE /bg-image
   * @description Delete background image
   */
  deleteBgImage: {
    response: z.void()
  },

  /**
   * @route       PATCH /
   * @description Update personalization settings
   */
  updatePersonalization: {
    body: z.object({
      data: z.object({
        fontFamily: z.string().optional(),
        theme: z.string().optional(),
        color: z.string().optional(),
        bgTemp: z.string().optional(),
        language: z.string().optional(),
        dashboardLayout: z.record(z.string(), z.any()).optional(),
        backdropFilters: z.record(z.string(), z.any()).optional()
      })
    }),
    response: z.void()
  }
}

const Settings = {
  /**
   * @route       PUT /avatar
   * @description Update user avatar
   */
  updateAvatar: {
    response: z.string()
  },

  /**
   * @route       DELETE /avatar
   * @description Delete user avatar
   */
  deleteAvatar: {
    response: z.void()
  },

  /**
   * @route       PATCH /
   * @description Update user profile
   */
  updateProfile: {
    body: z.object({
      data: z.object({
        username: z
          .string()
          .regex(/^[a-zA-Z0-9]+$/)
          .optional(),
        email: z.email().optional(),
        name: z.string().optional(),
        dateOfBirth: z.string().optional()
      })
    }),
    response: z.void()
  },

  /**
   * @route       POST /request-password-reset
   * @description Request password reset
   */
  requestPasswordReset: {
    response: z.void()
  }
}

type IAuth = InferApiESchemaDynamic<typeof Auth>
type ITwoFa = InferApiESchemaDynamic<typeof TwoFa>
type IOauth = InferApiESchemaDynamic<typeof Oauth>
type IPersonalization = InferApiESchemaDynamic<typeof Personalization>
type ISettings = InferApiESchemaDynamic<typeof Settings>

export type { IAuth, ITwoFa, IOauth, IPersonalization, ISettings }

export { Auth, TwoFa, Oauth, Personalization, Settings }
