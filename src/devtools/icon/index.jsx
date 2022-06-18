import { defineComponent } from "vue";
import { NIcon } from "naive-ui";
import { useTheme } from "../store/theme";
import { Theme } from "../common/enum";
import styl from "./index.module.scss";

export default defineComponent({
  setup() {
    const store = useTheme();
    return () => {
      return (
        <>
          {!store.isDark ? (
            <NIcon
              size="25"
              class={styl.icon}
              onClick={() => store.setTheme(Theme.Dark)}
            >
              <svg
                t="1655475482157"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="20439"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="256"
                height="256"
              >
                <defs>
                  <style type="text/css"></style>
                </defs>
                <path
                  d="M480 96v160h64V96zM240 195.008L195.008 240l112.992 114.016 46.016-46.016z m544 0l-114.016 112.992 46.016 46.016L828.992 240zM512 288c-123.36 0-224 100.64-224 224s100.64 224 224 224 224-100.64 224-224-100.64-224-224-224z m0 64c88.736 0 160 71.264 160 160s-71.264 160-160 160-160-71.264-160-160 71.264-160 160-160zM96 480v64h160v-64z m672 0v64h160v-64zM308 670.016L195.008 784 240 828.992l114.016-112.992z m408 0l-46.016 45.984 114.016 112.992 44.992-44.992zM480 768v160h64v-160z"
                  p-id="20440"
                ></path>
              </svg>
            </NIcon>
          ) : (
            <NIcon
              size="25"
              class={styl.icon}
              onClick={() => store.setTheme(Theme.Light)}
            >
              <svg
                t="1655475364628"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="15515"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="256"
                height="256"
              >
                <defs>
                  <style type="text/css"></style>
                </defs>
                <path
                  d="M868.8 513.6c0-182.4-137.6-334.4-318.4-352l-59.2-6.4 28.8 52.8c19.2 33.6 28.8 73.6 28.8 112 0 129.6-105.6 236.8-236.8 236.8-35.2 0-68.8-8-100.8-22.4l-54.4-25.6 9.6 59.2C192 742.4 339.2 868.8 513.6 868.8c195.2 0 355.2-160 355.2-355.2zM513.6 804.8c-124.8 0-232-78.4-272-190.4 22.4 4.8 44.8 8 68.8 8 166.4 0 300.8-134.4 300.8-300.8 0-28.8-4.8-57.6-12.8-84.8C718.4 272 804.8 384 804.8 513.6c0 160-131.2 291.2-291.2 291.2z"
                  p-id="15516"
                ></path>
              </svg>
            </NIcon>
          )}
        </>
      );
    };
  },
});
