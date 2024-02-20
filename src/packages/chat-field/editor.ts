import { type IDomEditor, type IEditorConfig } from "@wangeditor/editor";
import { onUploadImg } from "./events";
// 注册模块
import './modules/index'

/** 配置 */
export const useConfig = (editor: () => IDomEditor, config?: Partial<IEditorConfig>) => {
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
      }
    } as Partial<IEditorConfig>,
  };
};


