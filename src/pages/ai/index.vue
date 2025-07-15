<template>
  <t-chat
    layout="both"
    :style="{ height: '80vh !important' }"
    :data="chatList"
    :clear-history="chatList.length > 0 && !isStreamLoad"
    :text-loading="loading"
    :is-stream-load="isStreamLoad"
    @clear="clearConfirm"
  >
    <template v-if="!isStreamLoad" #actions="{ item, index }">
      <t-chat-action
        :content="item.content"
        :operation-btn="['replay', 'copy']"
        @operation="(...args) => handleOperation(index, ...args)"
      />
    </template>
    <template #footer>
      <t-chat-input :stop-disabled="isStreamLoad" @send="inputEnter" @stop="onStop" />
    </template>
  </t-chat>
</template>
<script lang="js" setup>
import { ref } from 'vue';

const fetchCancel = ref(null);
const loading = ref(false);
const isStreamLoad = ref(false);
const chatList = ref([]);

const handleOperation = (index, type) => {
  if (type === 'replay') {
    const userIndex = index + 1;
    const userItem = chatList.value[userIndex];

    if (!userItem || userItem.role !== 'user') {
      console.warn('⚠️ 找不到用户输入');
      return;
    }

    // ✅ 保留从 userIndex（含）之后的消息，即删除 replay 所在项及其以上的历史
    chatList.value = chatList.value.slice(userIndex + 1);

    // 🔁 重新触发问答
    inputEnter(userItem.content);
  }
};

const clearConfirm = () => {
  chatList.value = [];
};

// 🛑 实现中止请求
const onStop = () => {
  if (fetchCancel.value) {
    fetchCancel.value.abort();
    fetchCancel.value = null;
    loading.value = false;
    isStreamLoad.value = false;
  }
};

const inputEnter = (inputValue) => {
  if (isStreamLoad.value || !inputValue) return;

  chatList.value.unshift({
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: new Date().toDateString(),
    content: inputValue,
    role: 'user',
  });

  const placeholder = {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: '故事大王',
    datetime: new Date().toDateString(),
    content: '',
    role: 'assistant',
  };
  chatList.value.unshift(placeholder);

  handleData(inputValue);
};

const fetchSSE = async (fetchFn, options) => {
  const controller = new AbortController();
  fetchCancel.value = controller;

  const response = await fetchFn(controller.signal);
  const { success, fail, complete } = options;

  if (!response.ok) {
    complete?.(false, response.statusText);
    fail?.();
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  let buffer = '';

  reader.read().then(function processText({ done, value }) {
    if (done) {
      complete?.(true);
      return;
    }

    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      try {
        if (!line.trim()) continue;
        const json = JSON.parse(line);
        if (json.response) {
          success({ data: json.response });
        }
        if (json.done) {
          complete?.(true);
        }
      } catch (err) {
        console.warn('解析失败:', line);
      }
    }

    reader.read().then(processText);
  });
};

const handleData = async (question) => {
  loading.value = true;
  isStreamLoad.value = true;

  const lastItem = chatList.value[0];

  await fetchSSE(
    (signal) =>
      fetch(`http://112.125.17.180:5173/api/sse?q=${encodeURIComponent(question)}`, {
        signal,
      }),
    {
      success(result) {
        loading.value = false;
        const { data } = result;
        lastItem.content += data;
      },
      complete(isOk, msg) {
        if (!isOk || !lastItem.content) {
          lastItem.role = 'error';
          lastItem.content = msg || '请求失败';
        }
        isStreamLoad.value = false;
        loading.value = false;
      },
      fail() {
        lastItem.role = 'error';
        lastItem.content = '请求失败';
        isStreamLoad.value = false;
        loading.value = false;
      },
    },
  );
};
</script>
<style lang="less" scoped></style>
