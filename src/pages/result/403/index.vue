<template>
  <result title="403 Forbidden" :tip="t('pages.result.403.tips')">
    <t-space>
      <t-button @click="() => $router.push('/')">{{ t('pages.result.403.back') }}</t-button>
      <t-button v-if="$route.query.path" variant="outline" @click="applyMenuAccess"
        >请求添加{{ $route.query.title }}权限</t-button
      >
    </t-space>
  </result>
</template>
<script lang="ts">
export default {
  name: 'Result403',
};
</script>
<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';

import Result from '@/components/result/index.vue';
import { t } from '@/locales';

const applyMenuAccess = () => {
  MessagePlugin.success('已向管理员发起菜单请求权限');
};
</script>
