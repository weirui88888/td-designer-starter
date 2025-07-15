import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/m1',
    component: Layout,
    name: 'm1',
    redirect: '/m1/m2_1',
    meta: {
      title: '多级菜单一',
      icon: 'dashboard',
      orderNo: 10,
    },
    children: [
      {
        path: 'm2_1',
        name: 'm2_1',
        meta: { title: '多级菜单二-1' },
        redirect: '/m1/m2_1/m3_1',
        component: () => import('@/layouts/blank.vue'),
        children: [
          {
            path: 'm3_1',
            name: 'm3_1',
            component: () => import('@/layouts/components/FrameBlank.vue'),
            meta: {
              frameSrc: 'https://tdesign.tencent.com/starter/docs/vue-next/get-started',
              title: {
                zh_CN: 'TD官网',
                en_US: 'TD官网',
              },
            },
          },
          {
            path: 'm3_2',
            name: 'm3_2',
            component: () => import('@/layouts/components/FrameBlank.vue'),
            meta: {
              frameSrc: 'https://router.vuejs.org/zh/',
              title: {
                zh_CN: 'VUE-ROUTER',
                en_US: 'VUE-ROUTER',
              },
            },
          },
        ],
      },
      {
        path: 'm2_2',
        name: 'm2_2',
        component: () => import('@/layouts/components/FrameBlank.vue'),
        meta: {
          frameSrc: 'https://www.163.com',
          title: {
            zh_CN: '多级菜单二-2',
            en_US: '多级菜单二-2',
          },
        },
      },
    ],
  },
];
