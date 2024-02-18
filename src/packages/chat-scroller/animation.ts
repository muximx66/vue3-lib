export enum EASING {
  /** 匀速 */
  LINEAR = 'linear',
  /** 先慢后快 */
  EASE_IN_QUAD = 'easeInQuad',
  /** 先快后慢 */
  EASE_OUT_QUAD = 'easeOutQuad',
}

const Easings = {
  linear(x: number) {
    return x;
  },
  easeInQuad(x: number) {
    return x * x;
  },
  easeOutQuad(x: number) {
    return 1 - (1 - x) * (1 - x);
  },
};

export const requestAnimation = requestAnimationFrame || ((fn: any) => setTimeout(fn, 40));

export const cancelAnimation = cancelAnimationFrame || clearTimeout;

export class Animation {
  /** 执行中 */
  private onChange: ((ratio: number) => any);
  /** 完成 */
  private onComplete: ((ratio: number) => any) | void;
  /** 持续时间 */
  private duration: number;
  /** 缓动类型 */
  private easing: EASING = EASING.LINEAR;

  constructor(opts: {
    onChange: (ratio: number) => any;
    duration: number;
    onComplete?: (ratio: number) => any;
    easing?: EASING;
  }) {
    const { duration, easing, onChange, onComplete } = opts
    if (easing) this.easing = easing;
    this.duration = duration;
    this.onChange = onChange
    this.onComplete = onComplete;
  }

  /** 动画id */
  private animateId: any;
  /** 开始时间 */
  private start = 0;
  /** 消耗的时间差 */
  private passedTime = 0;
  /** 执行状态 */
  private isPlaying = false;
  /** 执行 */
  play(reset = true) {
    if (reset) this.passedTime = 0;
    this.start = Date.now() - this.passedTime;
    cancelAnimation(this.animateId)
    this.isPlaying = true;
    this.animateId = requestAnimation(() => this.step());
  }
  /** 恢复 */
  resume() {
    this.play(false);
  }
  /** 暂停 */
  pause() {
    if (!this.isPlaying) return false;
    this.isPlaying = false;
    return true;
  }
  /** 停止 */
  stop() {
    this.isPlaying = false;
    this.passedTime = 0;
    this.start = 0;
    cancelAnimation(this.animateId)
  }
  /** 步骤 */
  private step() {
    const { duration, start, isPlaying } = this;
    const now = Date.now();
    const passedTime = Math.min((now - start), duration);
    const timeRatio = passedTime / duration;
    this.render(timeRatio);
    if (isPlaying && timeRatio < 1) {
      this.animateId = requestAnimation(() => this.step());
    }
  }
  /** 渲染 */
  private render(timeRatio: number) {
    const { easing } = this;
    const ratio = Easings[easing](timeRatio);
    this.onChange(ratio)
    if (timeRatio >= 1) {
      this?.onComplete?.(ratio)
    }
  }
}