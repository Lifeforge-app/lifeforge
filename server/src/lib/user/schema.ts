import z from 'zod'

const usersSchemas = {
  users: {
    schema: z.object({
      email: z.email(),
      emailVisibility: z.boolean(),
      verified: z.boolean(),
      username: z.string(),
      name: z.string(),
      avatar: z.string(),
      dateOfBirth: z.string(),
      theme: z.enum(['system', 'light', 'dark']),
      color: z.string(),
      bgTemp: z.string(),
      bgImage: z.string(),
      backdropFilters: z.any(),
      fontFamily: z.string(),
      language: z.string(),
      dashboardLayout: z.any(),
      masterPasswordHash: z.string(),
      APIKeysMasterPasswordHash: z.string(),
      twoFASecret: z.string(),
      fontScale: z.number(),
      pinnedFontFamilies: z.any(),
      borderRadiusMultiplier: z.number(),
      bordered: z.boolean(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: 'id = @request.auth.id',
      viewRule: 'id = @request.auth.id',
      createRule: '',
      updateRule: 'id = @request.auth.id',
      deleteRule: null,
      name: 'users',
      type: 'auth',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          cost: 10,
          hidden: true,
          max: 0,
          min: 8,
          name: 'password',
          pattern: '',
          presentable: false,
          required: true,
          system: true,
          type: 'password'
        },
        {
          autogeneratePattern: '[a-zA-Z0-9_]{50}',
          hidden: true,
          max: 60,
          min: 30,
          name: 'tokenKey',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: true,
          system: true,
          type: 'text'
        },
        {
          exceptDomains: null,
          hidden: false,
          name: 'email',
          onlyDomains: null,
          presentable: false,
          required: false,
          system: true,
          type: 'email'
        },
        {
          hidden: false,
          name: 'emailVisibility',
          presentable: false,
          required: false,
          system: true,
          type: 'bool'
        },
        {
          hidden: false,
          name: 'verified',
          presentable: false,
          required: false,
          system: true,
          type: 'bool'
        },
        {
          autogeneratePattern: 'users[0-9]{6}',
          hidden: false,
          max: 150,
          min: 3,
          name: 'username',
          pattern: '^[\\w][\\w\\.\\-]*$',
          presentable: false,
          primaryKey: false,
          required: true,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'name',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/gif',
            'image/webp'
          ],
          name: 'avatar',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: ['256x0'],
          type: 'file'
        },
        {
          hidden: false,
          max: '',
          min: '',
          name: 'dateOfBirth',
          presentable: false,
          required: false,
          system: false,
          type: 'date'
        },
        {
          hidden: false,
          maxSelect: 1,
          name: 'theme',
          presentable: false,
          required: true,
          system: false,
          type: 'select',
          values: ['system', 'light', 'dark']
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'color',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'bgTemp',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSelect: 1,
          maxSize: 5242880000,
          mimeTypes: null,
          name: 'bgImage',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: null,
          type: 'file'
        },
        {
          hidden: false,
          maxSize: 2000000,
          name: 'backdropFilters',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'fontFamily',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'language',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSize: 2000000,
          name: 'dashboardLayout',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'masterPasswordHash',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'APIKeysMasterPasswordHash',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'twoFASecret',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          max: null,
          min: 0.1,
          name: 'fontScale',
          onlyInt: false,
          presentable: false,
          required: true,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          maxSize: 0,
          name: 'pinnedFontFamilies',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          max: null,
          min: 0,
          name: 'borderRadiusMultiplier',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          name: 'bordered',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      indexes: [
        'CREATE UNIQUE INDEX `__pb_users_auth__username_idx` ON `users` (username COLLATE NOCASE)',
        "CREATE UNIQUE INDEX `__pb_users_auth__email_idx` ON `users` (`email`) WHERE `email` != ''",
        'CREATE UNIQUE INDEX `__pb_users_auth__tokenKey_idx` ON `users` (`tokenKey`)'
      ],
      system: false,
      authRule: 'verified=true',
      manageRule: null,
      authAlert: {
        enabled: true,
        emailTemplate: {
          subject: 'Login from a new location',
          body: "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
        }
      },
      passwordAuth: {
        enabled: true,
        identityFields: ['email', 'username']
      },
      mfa: {
        enabled: false,
        duration: 1800,
        rule: ''
      },
      otp: {
        enabled: true,
        duration: 180,
        length: 6,
        emailTemplate: {
          subject: 'OTP for {APP_NAME}',
          body: "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
        }
      },
      authToken: {
        duration: 1209600
      },
      passwordResetToken: {
        duration: 1800
      },
      emailChangeToken: {
        duration: 1800
      },
      verificationToken: {
        duration: 604800
      },
      fileToken: {
        duration: 120
      },
      verificationTemplate: {
        subject: 'Verify your {APP_NAME} email',
        body: '<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class="btn" href="{APP_URL}/_/#/auth/confirm-verification/{TOKEN}" target="_blank" rel="noopener">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>'
      },
      resetPasswordTemplate: {
        subject: 'Reset your {APP_NAME} password',
        body: '<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class="btn" href="{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}" target="_blank" rel="noopener">Reset password</a>\n</p>\n<p><i>If you didn\'t ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>'
      },
      confirmEmailChangeTemplate: {
        subject: 'Confirm your {APP_NAME} new email address',
        body: '<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class="btn" href="{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}" target="_blank" rel="noopener">Confirm new email</a>\n</p>\n<p><i>If you didn\'t ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>'
      }
    }
  },
  font_family_upload: {
    schema: z.object({
      displayName: z.string(),
      family: z.string(),
      file: z.string(),
      weight: z.number(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'user__font_family_upload',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'displayName',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          max: 0,
          min: 0,
          name: 'family',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          maxSelect: 1,
          maxSize: 99999999999999,
          mimeTypes: [],
          name: 'file',
          presentable: false,
          protected: false,
          required: false,
          system: false,
          thumbs: [],
          type: 'file'
        },
        {
          hidden: false,
          max: null,
          min: null,
          name: 'weight',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      indexes: [],
      system: false
    }
  }
}

export default usersSchemas
