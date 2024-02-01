import { type IDomEditor, Boot } from "@wangeditor/editor";
import { plugins } from "./plugin";
import { onUploadImg } from "./events";
import elements from "./elements";

/** 配置 */
export const useConfig = (editor: () => IDomEditor, config?: any) => {
  return {
    mode: "simple",
    default: {
      ...config,
      autoFocus: false,
      showMenuTooltips: false,
      MENU_CONF: {
        ["uploadImage"]: {
          customUpload: (file: File) => {
            onUploadImg(file, editor());
          },
        },
      },
    },
  };
};

/** 注册 */
export function register() {
  /** 注册插件 */
  plugins.forEach((plugin) => {
    Boot.registerPlugin(plugin);
  });
  elements.forEach((element) => {
    /** 注册拦截 */
    Boot.registerPlugin(element.withEditor);
    /** dom元素转化成数据 */
    Boot.registerParseElemHtml({
      selector: element.selector,
      parseElemHtml: element.domToResume,
    });
    /** 注册数据转换成vNode */
    Boot.registerRenderElem({
      type: element.type,
      renderElem: element.resumeToVNode as any,
    });
    /** 注册数据转换成vNode */
    Boot.registerElemToHtml({
      type: element.type,
      elemToHtml: element.resumeToHtml,
    });
  });
}
register();
