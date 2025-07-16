<template>
  <div class="ollama-ai-container">
    <t-button shape="circle" theme="primary" class="ollama-ai-button" size="large" @click="visibleModelessDrag = true">
      <template #icon><logo-adobe-illustrate-icon /></template>
    </t-button>
    <t-dialog
      v-model:visible="visibleModelessDrag"
      :footer="false"
      header="AI助手"
      mode="modeless"
      width="60%"
      draggable
      :on-confirm="() => (visibleModelessDrag = false)"
    >
      <template #body>
        <t-chat
          layout="both"
          style="height: 600px"
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
    </t-dialog>
  </div>
</template>
<script lang="js" setup>
import { LogoAdobeIllustrateIcon } from 'tdesign-icons-vue-next';
import { ref } from 'vue';

const visibleModelessDrag = ref(false);

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
  console.log(response);
  const { success, fail, complete } = options;

  if (!response.ok) {
    complete?.(false, response.statusText);
    fail?.();
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  reader.read().then(function processText({ done, value }) {
    if (done) {
      complete?.(true);
      return;
    }

    const chunk = decoder.decode(value, { stream: true });
    // NOTE 这里chunk.split('\n');是因为有的情况下，读取到的字符串并不是一个对象字符串，而是类似于下面的字符串
    // {"model":"smollm:135m","created_at":"2025-07-16T02:41:16.837456638Z","response":".","done":false}
    // {"model":"smollm:135m","created_at":"2025-07-16T02:41:16.948700111Z","response":" He","done":false}
    // {"model":"smollm:135m","created_at":"2025-07-16T02:41:17.060607347Z","response":" had","done":false}
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            success({ data: json.response });
          }
          // 处理 obj
        } catch (e) {
          console.error('JSON解析失败:', line, e);
        }
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
<style lang="less" scoped>
.ollama-ai-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}
</style>
