import { Boot } from "@wangeditor/editor";

import img from "./img/index";
import file from "./file/index";
import link from "./link/index";
import leftLength from "./left-length/index";
import mentionModule from '@wangeditor/plugin-mention'

const modules = [img, file, link, leftLength, mentionModule];

modules.forEach((module) => Boot.registerModule(module));
