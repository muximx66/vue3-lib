import { ElementManager } from "./element";
import { createEditor } from "./editor";

/** 初始化内置元素 */
ElementManager.init();

/** 创建编辑器 */
export default createEditor;
