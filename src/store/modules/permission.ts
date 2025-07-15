// 前端 roles 控制菜单权限 通过登录后的角色对菜单就行过滤处理
// 如果需要前端 roles 控制菜单权限 请使用此文件代码替换 permission.ts 的内容

import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';

import { allRoutes } from '@/router';
import { store } from '@/store';

export function filterPermissionsRouters(
  routes: RouteRecordRaw[],
  roles: Array<string>,
): {
  accessedRouters: RouteRecordRaw[];
} {
  const roleSet = new Set([...roles]);

  function hasPermission(route: RouteRecordRaw): boolean {
    const roleCode = route.meta?.roleCode || route.name;
    return roleCode && roleSet.has(roleCode.toString());
  }

  function filter(routeList: RouteRecordRaw[] = []): RouteRecordRaw[] {
    const result: RouteRecordRaw[] = [];

    for (const route of routeList) {
      const hasSelfPermission = hasPermission(route);
      const children = route.children || [];

      if (hasSelfPermission) {
        // ✅ 自身有权限，保留整棵树（children 原样带上）
        result.push({
          ...route,
          children: children.length > 0 ? [...children] : undefined,
        });
        continue;
      }

      // ❌ 自身无权限，则尝试过滤 children
      const filteredChildren = filter(children);

      if (filteredChildren.length > 0) {
        result.push({
          ...route,
          children: filteredChildren,
        });
      }
    }

    return result;
  }

  const accessedRouters = filter(routes);

  return { accessedRouters };
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    whiteListRouters: ['/login'],
    routers: [],
    isFirstEnterAfterLogin: false,
  }),
  actions: {
    async initRoutes(roles: Array<string>) {
      let accessedRouters = [];

      // special token
      if (roles.includes('all')) {
        accessedRouters = allRoutes;
      } else {
        const res = filterPermissionsRouters(allRoutes, roles);
        accessedRouters = res.accessedRouters;
      }

      this.routers = accessedRouters;
      return accessedRouters;
    },
    resetRoutes() {
      this.routers = [];
    },
  },
  persist: {
    afterRestore: () => {},
    key: 'permission',
    paths: ['routers', 'isFirstEnterAfterLogin'],
  },
});

export function getPermissionStore() {
  return usePermissionStore(store);
}
