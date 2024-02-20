import { uuid } from "@/utils/utils";
import type { Row, Owner } from "./type";

export const getNickname = () => {
  const names = [
    "张三",
    "李四",
    "王五",
    "赵六",
    "孙七",
    "周八",
    "吴九",
    "郑十",
    "钱十一",
    "孙十二",
    "周十三",
    "吴十四",
    "郑十五",
    "钱十六",
    "孙十七",
    "周十八",
    "吴十九",
    "郑二十",
  ];
  return names[Math.floor(Math.random() * names.length)];
};
export const getOwner = () => (Math.random() > 0.5 ? "M" : "O") as Owner;
export const getDate = () =>
  Math.random() < 0.2 ? new Date().toLocaleDateString() : undefined;
export const getTip = () => {
  const tips = [
    "等待对方接受邀请",
    "某某加入聊天室",
    "某某离开聊天室",
    "某某拒绝了你的邀请",
  ];
  return {
    id: uuid(),
    msgType: "T",
    tip: tips[Math.floor(Math.random() * tips.length)],
  } as Row;
};
export const getImg = (index?: number) => {
  const imgs = [
    require("./assets/1.png"),
    require("./assets/2.png"),
    require("./assets/3.png"),
    require("./assets/4.png"),
  ];
  const randomIndex = Math.floor(Math.random() * imgs.length)
  return {
    id: uuid(),
    date: getDate(),
    nickname: getNickname(),
    msgType: "I",
    owner: getOwner(),
    imgUrl: imgs[typeof index === 'number' ? index : randomIndex],
  } as Row;
};
export const getMsg = () => {
  const contents = [
    "你好",
    "我是某某",
    "路上只我一个人，背着手踱着。这一片天地好像是我的;我也像超出了平常旳自己，到了另一世界里。我爱热闹，也爱冷静;爱群居，也爱独处。像今晚上，一个人在这苍茫旳月下，什么都可以想，什么都可以不想，便觉是个自由的人。",
    `网页2022年1月18日 ·
     这是一篇收集了100篇名家经典散文的文章，涵盖了叶圣陶、
    鲁迅、朱自清、梁实秋等多位名家的作品，展现了他们的文学风格
    和思想感情。`,
  ];
  return {
    id: uuid(),
    date: getDate(),
    nickname: getNickname(),
    msgType: "M",
    owner: getOwner(),
    content: contents[Math.floor(Math.random() * contents.length)],
  } as Row;
};

const chance = () => {
  const random = Math.random() * 100;
  if (random < 10) {
    return getTip();
  } else if (random < 30) {
    return getImg();
  } else {
    return getMsg();
  }
};

export const getRow = () => {
  return chance();
};

export const randomWait = (duration: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, Math.floor(Math.random() * duration));
  });

export const getHistory = async () => {
  await randomWait(500);
  const data: any[] = [];
  for (let i = 0; i < 20; i++) {
    data.push(getRow());
  }
  return {
    hasNextPage: true,
    list: data,
  };
};

export const getData = async (count?: number) => {
  await randomWait(500);
  const data: any[] = [];
  count = count ? count : Math.floor(Math.random() * 20);
  for (let i = 0; i < (count as number); i++) {
    data.push(getRow());
  }
  return {
    list: data,
  };
};
