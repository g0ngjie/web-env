import { defineComponent, ref } from "vue";
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NAlert,
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

    const handleSubmit = () => {
      formRef.value?.validate((errors) => {
        store.validateEnv();
        if (!errors) {
          store.submit();
          props.onClose();
        }
      });
    };

    const onLeave = () => {
      formRef.value?.restoreValidation();
      store.formReset();
    };

    return () => {
      return (
        <NDrawer
          width="99%"
          placement="left"
          v-model:show={props.visible.value}
          on-esc={props.onClose}
          on-after-leave={onLeave}
        >
          <NDrawerContent title="setting" closable>
            <NForm ref={formRef} model={store.form} size="small">
              <NFormItem
                path="title"
                label="title"
                rule={{ required: true, trigger: ["input", "blur"] }}
              >
                <NInput
                  v-model:value={store.form.title}
                  style={{ width: "300px" }}
                  placeholder="please input title"
                />
              </NFormItem>
              <NFormItem label="globalKey">
                <NInput
                  v-model:value={store.form.globalKey}
                  style={{ width: "300px" }}
                  placeholder="please input globalKey"
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
              {store.envWarning && (
                <NAlert
                  type="warning"
                  title="warning"
                  closable
                  on-close={() => (store.envWarning = "")}
                >
                  {store.envWarning}
                </NAlert>
              )}
              {store.form.dynamicEnvs.map((item, index) => {
                return (
                  <NSpace size="small">
                    <NFormItem
                      label-placement="left"
                      path={`dynamicEnvs[${index}].key`}
                      style={{ width: "150px" }}
                      rule={{
                        required: true,
                        message: "key is required",
                        trigger: ["input", "blur"],
                      }}
                    >
                      <NInput
                        v-model:value={item.key}
                        placeholder="please input key"
                      />
                    </NFormItem>
                    <NFormItem
                      label-placement="left"
                      path={`dynamicEnvs[${index}].value`}
                      style={{ width: "200px" }}
                      rule={{
                        required: true,
                        message: "env is required",
                        trigger: ["input", "blur"],
                      }}
                    >
                      <NInput
                        v-model:value={item.value}
                        placeholder="please input env"
                      />
                    </NFormItem>
                    {index === 0 && (
                      <NButton
                        size="tiny"
                        type="primary"
                        ghost
                        onClick={store.addEnv}
                      >
                        add
                      </NButton>
                    )}
                  </NSpace>
                );
              })}
            </NForm>
            <NButton size="tiny" type="primary" ghost onClick={handleSubmit}>
              submit
            </NButton>
          </NDrawerContent>
        </NDrawer>
      );
    };
  },
});
