import { h } from "snabbdom";
import { fileManager } from "./file";
import { uuid } from "@/utils/utils";
import {
  type IDomEditor,
  type SlateElement,
  DomEditor,
  SlateEditor,
} from "@wangeditor/editor";

/** 属性前缀 */
export const ATTRS_PREFIX = "data-w-e-";
/** 转化属性 */
export const toAttr = (key: string) => `${ATTRS_PREFIX}${key}`;
/** 通用属性 */
export const ATTRS = {
  /** 元素类型 */
  ELEM_TYPE: toAttr("type"),
  /** 元素是否void */
  ELEM_VOID: toAttr("is-void"),
  /** 元素是否inline */
  ELEM_INLINE: toAttr("is-inline"),
};

/** 图片 */
export class ChatImg {
  static readonly type = "chatImg";
  readonly type = ChatImg.type;

  static readonly isInline = true;
  readonly isInline = ChatImg.isInline;

  static readonly isVoid = true;
  readonly isVoid = ChatImg.isVoid;

  static readonly selector = `img[${ATTRS.ELEM_TYPE}="${ChatImg.type}"]`;
  readonly selector = ChatImg.selector;

  /** 生成抽象node */
  static genNode(id: string, url: string) {
    const resume = {
      type: ChatImg.type,
      id,
      url,
      children: [{ text: "" }],
    } as SlateElement;
    return resume;
  }
  /** 插入 */
  static insertNode(file: File | string, editor: IDomEditor) {
    let fileCopy: File;
    let id: string;
    if (typeof file === "string") {
      id = file;
      fileCopy = fileManager.get(file) as File;
    } else {
      id = uuid();
      fileCopy = file;
      fileManager.set(id, file);
    }
    editor.insertNode(ChatImg.genNode(id, URL.createObjectURL(fileCopy)));
    editor.focus();
    editor.move(1);
  }
  /** 拦截 */
  withEditor<T extends IDomEditor>(editor: T) {
    const { isInline, isVoid, move, onChange } = editor;
    const newEditor = editor;
    newEditor.isInline = (elem: any) => {
      const type = DomEditor.getNodeType(elem);
      if (type === ChatImg.type) return ChatImg.isInline;
      return isInline(elem);
    };
    newEditor.isVoid = (elem: any) => {
      const type = DomEditor.getNodeType(elem);
      if (type === ChatImg.type) return ChatImg.isVoid;
      return isVoid(elem);
    };
    newEditor.onChange = () => {
      const node = DomEditor.getSelectedNodeByType(newEditor, ChatImg.type);
      if (node) move(1);
      onChange();
    };
    return newEditor;
  }
  /** 数据转换成vNode */
  resumeToVNode(resume: any) {
    const { url, id } = resume;
    const vNode = h("img", {
      style: {
        margin: "0 10px",
        maxWidth: "200px",
      },
      props: {
        src: url,
      },
      attrs: {
        [ATTRS.ELEM_TYPE]: ChatImg.type,
        [toAttr("id")]: id,
        [toAttr("url")]: url,
      },
    });
    return vNode;
  }
  /** dom元素转化data */
  domToResume(dom: Element) {
    const id = getElemAttribute(dom, toAttr("id"));
    const url = getElemAttribute(dom, toAttr("url"));
    const resume = {
      type: ChatImg.type,
      id,
      url,
      children: [{ text: "" }],
    } as SlateElement;
    return resume;
  }
  /** 数据转化为自定义html字符串 */
  resumeToHtml(resume: any) {
    const type = ChatImg.type;
    const id = resume?.id || "";
    const html = `<${type} ${toAttr("id")}="${id}" ${toAttr(
      "type"
    )}="${type}"></${type}>`;
    return html;
  }
}

/** 文件 */
export class ChatFile {
  static readonly type = "chatFile";
  readonly type = ChatFile.type;

  static readonly isInline = true;
  readonly isInline = ChatFile.isInline;

  static readonly isVoid = true;
  readonly isVoid = ChatFile.isVoid;

  static readonly selector = `span[${ATTRS.ELEM_TYPE}="${ChatFile.type}"]`;
  readonly selector = ChatFile.selector;

  /** 生成抽象node */
  static genNode(id: string, url: string, name: string) {
    const resume = {
      type: ChatFile.type,
      id,
      url,
      name,
      children: [{ text: "" }],
    } as SlateElement;
    return resume;
  }

  /** 插入 */
  static insertNode(file: File | string, editor: IDomEditor) {
    let fileCopy: File;
    let id: string;
    if (typeof file === "string") {
      id = file;
      fileCopy = fileManager.get(file) as File;
    } else {
      id = uuid();
      fileCopy = file;
      fileManager.set(id, file);
    }
    editor.insertNode(
      ChatFile.genNode(id, URL.createObjectURL(fileCopy), fileCopy.name || "")
    );
    // 如果当前没有选中，则恢复选中
    if (editor.selection === null) editor.restoreSelection();
    // 如果当前正好选中了图片，则 move 一下（如：连续上传多张图片时）
    if (DomEditor.getSelectedNodeByType(editor, ChatImg.type)) {
      editor.move(1);
    }
  }

  /** 拦截 */
  withEditor<T extends IDomEditor>(editor: T) {
    const { isInline, isVoid, move, onChange } = editor;
    const newEditor = editor;
    newEditor.isInline = (elem: any) => {
      const type = DomEditor.getNodeType(elem);
      if (type === ChatFile.type) return ChatFile.isInline;
      return isInline(elem);
    };
    newEditor.isVoid = (elem: any) => {
      const type = DomEditor.getNodeType(elem);
      if (type === ChatFile.type) return ChatFile.isVoid;
      return isVoid(elem);
    };
    newEditor.onChange = () => {
      const node = DomEditor.getSelectedNodeByType(newEditor, ChatFile.type);
      if (node) move(1);
      onChange();
    };
    return newEditor;
  }
  /** 数据转换成vNode */
  resumeToVNode(resume: any) {
    const { url, id, name } = resume;
    const vNode = h(
      "span",
      {
        attrs: {
          [ATTRS.ELEM_TYPE]: ChatFile.type,
          [toAttr("id")]: id,
          [toAttr("url")]: url,
          [toAttr("name")]: name,
        },
        style: {
          padding: "0 10px",
          color: "#1890ff",
          textDecoration: "underline",
        },
      },
      name
    );
    return vNode;
  }
  /** dom元素转化data */
  domToResume(dom: Element) {
    const id = getElemAttribute(dom, toAttr("id"));
    const url = getElemAttribute(dom, toAttr("url"));
    const name = getElemAttribute(dom, toAttr("name"));
    const resume = {
      type: ChatFile.type,
      id,
      url,
      name,
      children: [{ text: "" }],
    } as SlateElement;
    return resume;
  }
  /** 数据转化为自定义html字符串 */
  resumeToHtml(resume: any) {
    const type = ChatFile.type;
    const id = resume?.id || "";
    const html = `<${type} ${toAttr("id")}="${id}" ${toAttr(
      "type"
    )}="${type}"></${type}>`;
    return html;
  }
}

/** 提及 */
export class ChatMention {
  static type = "chatMention";
  readonly type = ChatMention.type;

  static isInline = true;
  readonly isInline = ChatMention.isInline;

  static isVoid = true;
  readonly isVoid = ChatMention.isVoid;

  static readonly selector = `span[${ATTRS.ELEM_TYPE}="${ChatMention.type}"]`;
  readonly selector = ChatImg.selector;

  /** 生成抽象node */
  static genNode(id: string, name: string) {
    const resume = {
      type: ChatMention.type,
      id,
      name,
      children: [{ text: "" }],
    } as SlateElement;
    return resume;
  }

  /** 插入 */
  static insertNode(id: string, name: string, editor: IDomEditor) {
    const range = window.getSelection()?.getRangeAt(0);
    if (editor.selection === null) editor.restoreSelection();
    if (!range) return;
    const text = range.commonAncestorContainer.textContent || "";
    const startOffset = range.startOffset;
    const preText = text.slice(0, startOffset + 1);
    const index = preText.lastIndexOf("@");
    let deleteLength = startOffset - index;
    while (deleteLength > 0) {
      editor.deleteBackward("character");
      deleteLength--;
    }
    editor.insertNode(ChatMention.genNode(id, name));
  }

  /** 获取配置 */
  static getConfig(editor: IDomEditor) {
    return editor.getConfig()?.EXTEND_CONF?.mentionConfig as {
      showModal: (editor: IDomEditor) => void;
      hideModal: (editor: IDomEditor) => void;
      onInput: (value: string, editor: IDomEditor) => void;
    };
  }

  /** 拦截 */
  withEditor<T extends IDomEditor>(editor: T) {
    const { isInline, isVoid, insertText, onChange, move } = editor;
    const newEditor = editor;
    newEditor.isInline = (elem: any) => {
      const type = DomEditor.getNodeType(elem);
      if (type === ChatMention.type) return ChatMention.isInline;
      return isInline(elem);
    };
    newEditor.isVoid = (elem: any) => {
      const type = DomEditor.getNodeType(elem);
      if (type === ChatMention.type) return ChatMention.isVoid;
      return isVoid(elem);
    };
    newEditor.onChange = () => {
      const selection = newEditor.selection;
      console.log(selection?.anchor, selection?.focus);
      const node = DomEditor.getSelectedNodeByType(newEditor, ChatMention.type);
      if (node) move(1);
      if (
        newEditor.isFocused() &&
        selection &&
        selection.anchor.offset === selection.focus.offset
      ) {
        const [node] = SlateEditor.node(newEditor, newEditor.selection as any);
        if (!(node as any).type && (node as any).text) {
          const offset = newEditor.selection?.anchor.offset || 0;
          const text = (node as any).text || "";
          const frontText = text.slice(0, offset + 1);
          const behindText = text.slice(offset + 1);
          const hide = () => {
            const { hideModal } = ChatMention.getConfig(newEditor) || {};
            if (hideModal) {
              hideModal(newEditor);
            }
          };
          if (frontText.indexOf("@") > -1) {
            const { onInput, showModal } =
              ChatMention.getConfig(newEditor) || {};
            if (showModal) {
              showModal(newEditor);
            }
            if (onInput) {
              const index = frontText.lastIndexOf("@");
              const value = frontText.slice(index + 1);
              onInput(value, newEditor);
            }
          } else if (behindText.indexOf("@") > -1) {
            hide();
          } else {
            hide();
          }
        }
      }
      onChange();
    };
    newEditor.insertText = (text: string) => {
      const elems = DomEditor.getSelectedElems(newEditor);
      const isSelectedVoidElem = elems.some((elem: any) =>
        newEditor.isVoid(elem)
      );
      if (isSelectedVoidElem) {
        insertText(text);
        return;
      }
      const [node, path] = SlateEditor.node(
        newEditor,
        newEditor.selection as any
      );
      if (text === "@") {
        const { showModal } = ChatMention.getConfig(newEditor) || {};
        if (showModal) {
          showModal(newEditor);
        }
      }
      insertText(text);
    };
    return newEditor;
  }
  /** 数据转换成vNode */
  resumeToVNode(resume: any) {
    const { id, name } = resume;
    const vNode = h(
      "span",
      {
        attrs: {
          [ATTRS.ELEM_TYPE]: ChatMention.type,
          [toAttr("id")]: id,
          [toAttr("name")]: name,
        },
        style: {
          color: "#1890ff",
          paddingRight: "4px",
        },
      },
      `@${name}`
    );
    return vNode;
  }
  /** dom元素转化data */
  domToResume(dom: Element) {
    const id = getElemAttribute(dom, toAttr("id"));
    const name = getElemAttribute(dom, toAttr("name"));
    const resume = {
      type: ChatMention.type,
      id,
      name,
      children: [{ text: "" }],
    } as SlateElement;
    return resume;
  }
  /** 数据转化为自定义html字符串 */
  resumeToHtml(resume: any) {
    const type = ChatMention.type;
    const id = resume?.id || "";
    const html = `<${type} ${toAttr("id")}="${id}" ${toAttr(
      "type"
    )}="${type}"></${type}>`;
    return html;
  }
}

/** 获取元素类型 */
export const getElemAttribute = (el: any, attr: string) => {
  if (el.getAttribute) {
    return el.getAttribute(attr) || "";
  }
  if (el.dataset) {
    return el.dataset[attr] || "";
  }
  return "";
};

export default [new ChatImg(), new ChatFile(), new ChatMention()];
