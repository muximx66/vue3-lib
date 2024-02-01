/** I-图片 A-附件 M-消息 E-表情 T-提示 */
export type MsgType = "I" | "A" | "M" | "E" | "T";
/** M-我 O-对方 */
export type Owner = "M" | "O";

export type Row = {
  id: string;
  msgType: MsgType;
  date?: string;
  owner?: Owner;
  tip?: string;
  nickname?: string;
  imgUrl?: string;
  attchUrl?: string;
  content?: string;
};
