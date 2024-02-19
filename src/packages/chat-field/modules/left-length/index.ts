import { IModuleConf } from '@wangeditor/editor'
import withPlugin from './plugin'

const leftLength: Partial<IModuleConf> = {
  editorPlugin: withPlugin,
}

export default leftLength