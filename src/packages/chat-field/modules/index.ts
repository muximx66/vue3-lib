import { Boot } from "@wangeditor/editor";

import img from "./img/index";
import file from "./file/index";
import link from "./link/index";
import leftLength from "./left-length/index";
import { mentionSymbol } from "./mention/index";

const modules = [img, file, link, leftLength, mentionSymbol];

modules.forEach((module) => Boot.registerModule(module));
