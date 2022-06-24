<template>
  <div class="container operate">
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
import { useMouse } from "@vueuse/core";
import { useCurrentEnv } from "./hooks/chrome";
import { NDescriptions, NDescriptionsItem } from "naive-ui";

export default defineComponent({
  components: { NDescriptions, NDescriptionsItem },
  setup() {
    const envs = ref([]);
    useCurrentEnv().then((target) => {
      Object.keys(target).forEach((key) => {
        envs.value.push({
          globalKey: key,
          envs: target[key],
        });
      });
    });
    const { x, y } = useMouse();
    return {
      envs,
    };
  },
});
</script>

<style>
.container {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  background-color: rgba(38, 38, 38, 0.5);
  border-radius: 5px;
  box-shadow: 0 0 1px #f5f5f5;
  padding: 5px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  color: #fff;
}

.operate {
  cursor: move;
}
</style>
