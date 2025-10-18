import { forgeRouter } from '@functions/routes';
const appRoutes = forgeRouter({
  achievements: (await import('@lib/achievements/server')).default
});
export default appRoutes;