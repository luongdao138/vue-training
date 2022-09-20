import { useAuth } from '@/stores/auth';
import { getCurrentUser } from '@/services/auth';
import router from '@/router';

// const addGuardNavigation = () => {
router.beforeEach(async (to: string, from: string, next) => {
  const authStore = useAuth();

  // route này cần đăng nhập và đã đăng nhập sẵn rồi thì ko làm gì cả
  if (to.meta.requiredAuth && authStore.user) {
    return next();
  }

  await authStore.getCurrentAuthUser();

  // route này cần đăng nhập nhưng lại chưa
  if (to.meta.requiredAuth && !authStore.user) {
    return next('/login');
  }

  // route này đã đăng nhập rồi thì không được vào
  if (to.meta.requiredAuth === false && authStore.user) {
    return next('/dashboard');
  }

  return next();
});
// };

// export default addGuardNavigation;
