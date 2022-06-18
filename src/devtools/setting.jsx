import { defineComponent } from "vue";
import { NDrawer, NDrawerContent } from "naive-ui";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const show = () => {
      console.log("show");
    };
    return () => {
      return (
        <NDrawer
          width="99%"
          placement="right"
          v-model:show={props.visible.value}
          on-esc={props.onClose}
        >
          <NDrawerContent title="setting" closable>
            <p>Settings</p>
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
