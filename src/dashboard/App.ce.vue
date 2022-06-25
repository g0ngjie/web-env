<template>
  <div ref="domRef" v-if="envs.length > 0" class="container auto-put-away">
    <NDescriptions
      v-for="(env, index) in envs"
      :key="index"
      :column="1"
      size="small"
      label-placement="left"
    >
      <NDescriptionsItem label="_key">
        {{ env.globalKey }}
      </NDescriptionsItem>
      <NDescriptionsItem
        v-for="(target, key) in env.envs"
        :key="key"
        :label="key"
      >
        {{ target }}
      </NDescriptionsItem>
    </NDescriptions>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { useCurrentEnv } from "./hooks/chrome";
import { NDescriptions, NDescriptionsItem } from "naive-ui";

export default defineComponent({
  components: { NDescriptions, NDescriptionsItem },
  setup() {
    const envs = ref([]);
    const domRef = ref(null);
    useCurrentEnv().then((target) => {
      Object.keys(target).forEach((key) => {
        envs.value.push({
          globalKey: key,
          envs: target[key],
        });
      });
    });

    setTimeout(() => {
      if (domRef.value)
        domRef.value.style.left = `-${domRef.value.offsetWidth - 5}px`;
    }, 1000);

    return { envs, domRef };
  },
});
</script>

<style>
.container {
  background-color: rgba(38, 38, 38, 0.4);
  border-radius: 3px;
  box-shadow: 0 0 1px #f5f5f5;
  padding: 5px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 20px;
  left: 0;
  z-index: 999;
  color: #fff;
  font-size: 12px;
}

.auto-put-away {
  transition: all 0.2s;
}
.auto-put-away:hover {
  left: 0 !important;
}
</style>
