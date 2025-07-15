import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/form',
    name: 'form',
    component: Layout,
    redirect: '/form/base',
    meta: {
      title: {
        zh_CN: '表单页',
        en_US: 'Form',
      },
      icon: 'edit-1',
    },
    children: [
      {
        path: 'step',
        name: 'FormStep',
        component: () => import('@/pages/form/step/index.vue'),
        meta: {
          title: {
            zh_CN: '分步表单页',
            en_US: 'Step Form',
          },
        },
      },
    ],
  },
];
