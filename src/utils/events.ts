import type { Directive } from "vue";

/** 长按事件类 */
export class LongPress {
  /** 定时器id */
  private timer: any = null;
  /** 执行函数 */
  private cb: ((...args: any) => any) | null = null;
  /** 绑定元素 */
  private el: HTMLElement | null = null;
  private pressTime = 1000;
  /** 允许执行 */
  private enableExec = false;
  constructor(el: HTMLElement, cb: (...args: any) => any, pressTime?: number) {
    this.cb = cb;
    this.el = el;
    if (pressTime) this.pressTime = pressTime;
    this.init();
  }
  public init() {
    const start = this.start.bind(this);
    const cancel = this.cancel.bind(this);
    const exec = this.exec.bind(this);
    this.start = start;
    this.cancel = cancel;
    this.exec = exec;
    this.el?.addEventListener("mousedown", start);
    this.el?.addEventListener("touchstart", start);
    this.el?.addEventListener("touchmove", cancel);
    this.el?.addEventListener("mousemove", cancel);
    this.el?.addEventListener("touchend", exec);
    this.el?.addEventListener("mouseup", exec);
  }
  public destroy() {
    const start = this.start;
    const cancel = this.cancel;
    const exec = this.exec;
    this.el?.removeEventListener("mousedown", start);
    this.el?.removeEventListener("touchstart", start);
    this.el?.removeEventListener("touchmove", cancel);
    this.el?.removeEventListener("mousemove", cancel);
    this.el?.removeEventListener("mouseup", exec);
    this.el?.removeEventListener("touchend", exec);
    cancel();
    this.el = null;
    this.cb = null;
  }
  public start() {
    this.cancel();
    this.timer = setTimeout(() => {
      this.enableExec = true;
    }, this.pressTime);
  }
  public cancel() {
    this.enableExec = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }
  public exec() {
    if (!this.enableExec) return;
    this.cb && this.cb();
  }
}

/** 长按事件指令 */
export const vLongPress: Directive = (() => {
  let longPress: LongPress | undefined;
  return {
    mounted(el, binding) {
      longPress = new LongPress(el, binding.value);
    },
    unmounted() {
      longPress?.destroy();
    },
  };
})();

/** 文本选中 */
export class TextSelect {
  private el: HTMLElement;
  private cb: (...args: any) => any;
  constructor(el: HTMLElement, cb: (...args: any) => any) {
    this.el = el;
    this.cb = cb;
  }
  public init() {
    const onMouseUp = this.onMouseUp.bind(this);
    this.onMouseUp = onMouseUp;
    this.el.addEventListener("mouseup", onMouseUp);
    this.el.addEventListener("touchend", onMouseUp);
  }
  public onMouseUp() {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (text && this.el.contains(selection?.focusNode as Node)) {
      this.cb(text);
    }
  }
  public destroy() {
    const onMouseUp = this.onMouseUp;
    this.el.removeEventListener("mouseup", onMouseUp);
    this.el.removeEventListener("touchend", onMouseUp);
  }
}
/** 选中文本指令 */
export const vTextSelect: Directive = (() => {
  let textSelect: TextSelect | undefined;
  return {
    mounted(el, binding) {
      textSelect = new TextSelect(el, binding.value);
      textSelect.init();
    },
    unmounted() {
      textSelect?.destroy();
    },
  };
})();

/** 复制文本 */
export class CopyText {
  private text: string;
  private success?: (...args: any) => any;
  private error?: (...args: any) => any;
  constructor(
    text: string,
    success?: (...args: any) => any,
    error?: (...args: any) => any
  ) {
    this.text = text;
    this.success = success;
    this.error = error;
    this.init();
  }
  public init() {
    const copySuccess = () => this.success && this.success();
    const copyError = () => this.error && this.error();
    const text = this.text;
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(text).then(copySuccess, copyError);
      return;
    }
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.select();
    const res = document.execCommand("Copy");
    document.body.removeChild(input);
    if (res) {
      copySuccess();
    } else {
      copyError();
    }
  }
}
