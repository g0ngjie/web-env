import { defineComponent } from "vue";
import Devtools from "@devtools/page/index";
import styl from "./app.module.scss";

export default defineComponent({
  setup() {
    return () => {
      return <Devtools class={styl.container} />;
    };
  },
});
