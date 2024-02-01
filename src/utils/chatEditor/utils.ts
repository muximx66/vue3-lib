/** 创建range */
export const createRange = (el?: Node) => {
  const range = document.createRange();
  if (el) range.selectNode(el);
  return range;
};
