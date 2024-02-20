import { Boot } from "@wangeditor/editor";

import img from "./img/index";
import file from "./file/index";
import link from "./link/index";
import mention from "./mention/index";
import leftLength from "./left-length/index";

const modules = [img, file, mention, link, leftLength];

modules.forEach((module) => Boot.registerModule(module));
