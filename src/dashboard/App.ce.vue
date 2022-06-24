<template>
  <div class="container operate">
    <div>{{ x }}</div>
    <div>{{ y }}</div>
    <div>{{ sourceType }}</div>
    <div>{{ env }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useMouse } from "@vueuse/core";
import { useCurrentEnv } from "./hooks/chrome";

const env = ref({});
useCurrentEnv().then((target) => (env.value = target));

const { x, y, sourceType } = useMouse();
</script>

<style>
.container {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  background-color: rebeccapurple;
  height: 200px;
  width: 200px;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.operate {
  cursor: move;
}
</style>
