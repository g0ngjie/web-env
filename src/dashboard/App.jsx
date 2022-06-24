import { defineComponent, ref, onMounted } from "vue";
import { NSwitch, NEmpty, NScrollbar } from "naive-ui";
import { useCurrentEnv } from "./hooks/chrome";
import styl from "./app.module.scss";

export default defineComponent({
  setup() {
    const env = ref({ aaa: 123 });
    onMounted(async () => {
      env.value = await useCurrentEnv();
    });

    return () => {
      return <div class={[styl.container, styl.operate]}>{env}asdf</div>;
    };
  },
});
