import { IModuleConf } from '@wangeditor/editor'
import { renderConf } from './render-elem'
import { elemToHtmlConf } from './elem-to-html'
import { parseHtmlConf } from './parse-elem-html'
import withPlugin from './plugin'

const image: Partial<IModuleConf> = {
  renderElems: [renderConf],
  elemsToHtml: [elemToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  menus: [],
  editorPlugin: withPlugin,
}

export default image