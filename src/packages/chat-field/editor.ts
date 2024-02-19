import { type IDomEditor } from "@wangeditor/editor";
import { onUploadImg } from "./events";
// 注册模块
import './modules/index'

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


