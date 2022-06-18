import { defineComponent, ref } from "vue";
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NButton,
} from "naive-ui";
import { useData } from "./store/data";

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
    const store = useData();
    const formRef = ref(null);
    const rules = {
      title: [{ required: true, trigger: ["input", "blur"] }],
      env: [{ required: true, trigger: ["input", "blur"] }],
    };
    const handleSubmit = () => {
      formRef.value?.validate((errors) => {
        if (!errors) {
          props.onClose();
        }
      });
    };

    return () => {
      return (
        <NDrawer
          width="99%"
          placement="left"
          v-model:show={props.visible.value}
          on-esc={props.onClose}
        >
          <NDrawerContent title="setting" closable>
            <NForm ref={formRef} model={store.form} rules={rules}>
              <NFormItem path="title" label="title">
                <NInput
                  v-model:value={store.form.title}
                  style={{ width: "300px" }}
                  placeholder="please input title"
                />
              </NFormItem>
              <NFormItem label="description">
                <NInput
                  v-model:value={store.form.description}
                  style={{ width: "300px" }}
                  type="textarea"
                  placeholder="please input description"
                />
              </NFormItem>
              <NFormItem path="env"></NFormItem>
            </NForm>
            <NButton
              size="tiny"
              type="primary"
              ghost
              onClick={() => handleSubmit()}
            >
              submit
            </NButton>
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
