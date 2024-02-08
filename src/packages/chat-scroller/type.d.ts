import { SLOTS } from "./enum";
import { type ShallowRef } from "vue";

export type ShallowElem = ShallowRef<HTMLElement | void>;

export type ChildElem = {
  el: HTMLElement;
  size: number;
  data: any;
  type: SLOTS;
};


export type AnyFn = (...args: any[]) => any;

export type AddViewUpdateEvent = (fn: AnyFn) => void;