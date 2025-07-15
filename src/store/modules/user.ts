import { defineStore } from 'pinia';

import type { UserInfo } from '@/types/interface';

const InitUserInfo: UserInfo = {
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const mockLogin = async (userInfo: Record<string, unknown>) => {
        // 登录请求流程
        window?.umami?.identify(userInfo.account as string);
        return {
          code: 200,
          message: '登录成功',
          data: `${userInfo.account}`,
        };
      };

      const res = await mockLogin(userInfo);
      if (res.code === 200) {
        this.token = res.data;
      } else {
        throw res;
      }
    },
    async getUserInfo() {
      const mockRemoteUserInfo = async (token: string) => {
        if (token === 'admin') {
          return {
            name: 'admin',
            roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        if (token === 'xdz') {
          return {
            name: 'xdz',
            roles: ['UserIndex', 'DashboardBase', 'AiIndex', 'm3_2'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: '小马扎',
          roles: ['DashboardBase', 'UserIndex'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(this.token);

      this.userInfo = res;
    },
    async logout() {
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: true,
});
