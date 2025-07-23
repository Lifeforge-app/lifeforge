import type { Router } from '@server/core/routes'

type RouterType =
  Router extends Record<string, infer T>
    ? T extends { register: (router: Router) => void }
      ? T
      : never
    : never
