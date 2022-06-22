import { defineComponent, ref } from "vue";
import { NSwitch } from "naive-ui";
import styl from "./app.module.scss";

export default defineComponent({
  setup() {
    const switchOh = ref(false);
    return () => {
      return (
        <div class={styl.container}>
          <NSwitch size="small" v-model:value={switchOh.value} round={false} />
        </div>
      );
    };
  },
});
