<script setup>
import { computed, ref } from "vue";
import Devtools from "@/devtools/index";
const env = ref("");
const timeEnv = ref(0);
const setEnv = () => {
  window.env = "web env";
  window.timeEnv = Date.now();
  env.value = "web env";
  timeEnv.value = Date.now();

  console.log("[debug]chrome:", chrome);
  console.log("[debug]chrome.devtools:", chrome.devtools);
  if (!chrome || !chrome.devtools) return;
  chrome.devtools.inspectedWindow.eval(
    `window.env = "chrome env"; window.timeEnv = ${Date.now()}`
  );
};
</script>

<template>
  <!-- {{ env }}
  {{ timeEnv }}
  <button @click="setEnv">setEnv1</button> -->
  <Devtools />
</template>
