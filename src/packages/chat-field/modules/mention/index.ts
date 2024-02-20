import { IModuleConf } from "@wangeditor/editor";
import { renderSymbolConf } from "./render-elem";
import { symbolToHtmlConf } from "./elem-to-html";
import { parseSymbolHtmlConf } from "./parse-elem-html";
import { withSymbolPlugin } from "./plugin";

export const mentionSymbol: Partial<IModuleConf> = {
  renderElems: [renderSymbolConf],
  elemsToHtml: [symbolToHtmlConf],
  parseElemsHtml: [parseSymbolHtmlConf],
  menus: [],
  editorPlugin: withSymbolPlugin,
};
