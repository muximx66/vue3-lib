import { Boot } from '@wangeditor/editor'

import img from './img/index'
import link from './link/index'
import leftLength from './left-length/index'

const modules = [img, link, leftLength]

modules.forEach(module => Boot.registerModule(module))