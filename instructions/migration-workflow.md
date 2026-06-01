Below are the steps to migrate the module into the new codebase architecture.

1. `cd` into the `apps/` directory.
2. Clone the repo manually from github, <author>/lifeforge-module-<moduleName>. For example, lifeforge-app/lifeforge-module-wallet.
3. Rename the folder into <author>--<moduleName>. If the user is `lifeforge-app`, rename into `lifeforge--<moduleName>`, otherwise keep the username of the author as is.
4. Replace all occurrence of `shared` into `@lifeforge/shared`.
5. Replace all occurrence of `lifeforge-ui` into `@lifeforge/ui`.
6. Run `bun install` to create symlinks.
7.
