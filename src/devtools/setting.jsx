import { defineComponent, ref } from "vue";
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInputGroup,
  NInput,
  NSelect,
  NButton,
  NSpace,
  NAlert,
} from "naive-ui";
import { EnvFieldType as Type } from "./common/enum";
import { useData } from "./store/data";
import { isNumber } from "@alrale/common-lib";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isEdit: {
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

    const options = ref([
      {
        label: Type.String,
        value: Type.String,
      },
      {
        label: Type.Number,
        value: Type.Number,
      },
      {
        label: Type.Boolean,
        value: Type.Boolean,
      },
    ]);

    const handleSubmit = () => {
      formRef.value?.validate((errors) => {
        store.validateEnv();
        if (!errors) {
          store.submit(props.isEdit.value);
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
              <NFormItem
                label="globalKey"
                rule={{
                  trigger: ["input", "blur"],
                  validator() {
                    if (store.form.globalKey.toLowerCase() === "window") {
                      return new Error("globalKey can not be window");
                    }
                  },
                }}
              >
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
                      style={{ minWidth: "200px" }}
                      rule={{
                        required: true,
                        trigger: ["blur"],
                        validator() {
                          if (item.key === "") {
                            return new Error("key is required");
                          }
                          const firstChar = item.key.charAt(0);
                          if (isNumber(item.key) || isNumber(firstChar)) {
                            return new Error("key cannot be a number type");
                          }
                        },
                      }}
                    >
                      <NInput
                        v-model:value={item.key}
                        placeholder="please input key"
                      />
                    </NFormItem>
                    :
                    <NFormItem
                      label-placement="left"
                      path={`dynamicEnvs[${index}].value`}
                      style={{ minWidth: "400px" }}
                      rule={{
                        required: true,
                        trigger: ["blur"],
                        validator() {
                          if (item.value === "") {
                            return new Error("env is required");
                          }
                          if (
                            item.type === Type.Number &&
                            !isNumber(item.value)
                          ) {
                            return new Error("env must be of type number");
                          }
                          if (
                            item.type === Type.Boolean &&
                            !["true", "false"].includes(item.value)
                          ) {
                            return new Error(
                              "env must be a boolean type of true or false"
                            );
                          }
                        },
                      }}
                    >
                      <NInputGroup>
                        <NSelect
                          style={{ width: "130px" }}
                          v-model:value={item.type}
                          options={options.value}
                        />
                        <NInput
                          v-model:value={item.value}
                          placeholder="please input env"
                        />
                      </NInputGroup>

                      {index === 0 ? (
                        <NButton type="primary" ghost onClick={store.addEnv}>
                          o
                        </NButton>
                      ) : (
                        <NButton
                          type="error"
                          ghost
                          onClick={() => store.removeEnv(index)}
                        >
                          x
                        </NButton>
                      )}
                    </NFormItem>
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
