import { uuid } from "./utils";

export type Task = {
  id: string;
  params: any;
  compeleted: boolean;
  res: any;
};
export type Queue = Map<string, Task>;
export type Result = {
  id: string;
  params: any;
  res: any;
};
export type Post = (...args: any) => Promise<any>;
export type AddExpire = (id: string) => void;
export type Filter = (
  task: Task,
  queue: Queue,
  expire: AddExpire
) => boolean | void;
export type After = (res: Result[]) => any;

export class ListHttpQueue {
  private queue: Queue = new Map();
  private expired = new Set<string>();
  private post: Post;
  private after: After;
  private filter: Filter;
  constructor(post: Post, filter: Filter, after: After) {
    this.post = post;
    this.filter = filter;
    this.after = after;
  }
  add(params: any, post?: Post) {
    const id = uuid();
    const task = {
      id,
      params,
      compeleted: false,
      res: undefined,
    } as Task;
    if (this.queue.size > 1) {
      const next = this.filter(task, this.queue, (id: string) => {
        this.expire(id);
        this.remove(id);
      });
      if (next === false) return;
    }
    this.queue.set(id, task);
    post = post || this.post;
    this.exec(post, task);
  }
  expire(id: string) {
    this.expired.add(id);
  }
  remove(id: string) {
    this.queue.delete(id);
  }
  isExpired(id: string) {
    return this.expired.has(id);
  }
  async exec(post: Post, task: Task) {
    const { id, params } = task;
    const res = await post(params);
    if (this.isExpired(id)) {
      this.remove(id);
      this.expired.delete(id);
      return;
    }
    const queue = this.queue;
    task.compeleted = true;
    task.res = res;
    const queueArr = Array.from(queue);
    const resArr: Result[] = [];
    queueArr.some((arr) => {
      const [i, t] = arr;
      if (!t.compeleted) return true;
      if (this.isExpired(i)) return;
      resArr.push({
        id: i,
        params: t.params,
        res: t.res,
      });
    });
    this.after(resArr);
    resArr.forEach((res) => this.remove(res.id));
  }
}
