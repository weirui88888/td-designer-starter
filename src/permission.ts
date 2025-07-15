import 'nprogress/nprogress.css';

import NProgress from 'nprogress';
import { MessagePlugin } from 'tdesign-vue-next';
import type { RouteRecordRaw } from 'vue-router';

import router from '@/router';
import { getPermissionStore, useUserStore } from '@/store';

function findRouteByName(routes: RouteRecordRaw[], name: string): boolean {
  if (name === 'Result403') return true; // 避免死循环
  return routes.some((route) => {
    if (route.name === name) return true;
    if (route.children) return findRouteByName(route.children, name);
    return false;
  });
}

NProgress.configure({ showSpinner: false });

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const userStore = useUserStore();
  const permissionStore = getPermissionStore();
  const { whiteListRouters } = permissionStore;
  const hasToken = !!userStore.token;
  if (hasToken) {
    if (to.path === '/login' || to.path === '/result/404') {
      next(); // 已登录访问登录页，放行（你也可以选择重定向首页）
      return;
    }

    try {
      // 如果还没初始化路由，就初始化
      if (permissionStore.routers.length === 0) {
        console.log('首次进入，初始化权限路由...');
        await userStore.getUserInfo();
        await permissionStore.initRoutes(userStore.userInfo.roles);
      }
      const hasPermission = findRouteByName(permissionStore.routers, to.name as string);
      if (hasPermission) {
        next();
      } else if (permissionStore.isFirstEnterAfterLogin) {
        next({ name: 'dashboard' }); // 首次登录权限不足，跳首页dashboard
      } else {
        const query: Recordable = {
          title: (to.meta.title as { zh_CN: string })?.zh_CN,
          path: encodeURIComponent(to.path),
        };
        next({ name: 'Result403', query }); // Result403
      }
    } catch (error: any) {
      MessagePlugin.error(error.message || '路由权限处理异常');
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      });
    }
  } else {
    // 无 token 的情况
    if (whiteListRouters.includes(to.path)) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      });
    }
  }
});

router.afterEach((to) => {
  const permissionStore = getPermissionStore();
  // 离开页面关闭进度条
  NProgress.done();

  // 如果进入登录页，清空用户信息和权限路由
  if (to.path === '/login') {
    const userStore = useUserStore();
    userStore.logout();
    permissionStore.resetRoutes();
  }

  if (permissionStore.isFirstEnterAfterLogin) {
    permissionStore.isFirstEnterAfterLogin = false;
  }
});
