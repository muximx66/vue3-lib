export function getNodeAndOffset(wrap_dom: Node, start = 0, end = 0) {
  const txtList: Node[] = [];
  const map = function (chlids: NodeList) {
    [...chlids].forEach((el) => {
      if (el.nodeName === "#text") {
        txtList.push(el);
      } else {
        map(el.childNodes);
      }
    });
  };
  // 递归遍历，提取出所有 #text
  map(wrap_dom.childNodes);
  // 计算文本的位置区间 [0,3]、[3, 8]、[8,10]
  const clips = txtList.reduce((arr, item, index) => {
    const text = item.textContent || "";
    const textLenth = text.length;
    const end = textLenth + (arr[index - 1] ? arr[index - 1][2] : 0);
    arr.push([item, end - textLenth, end]);
    return arr;
  }, [] as [Node, number, number][]);
  // 查找满足条件的范围区间
  const startNode = clips.find((el) => start >= el[1] && start < el[2]);
  const endNode = clips.find((el) => end >= el[1] && end < el[2]);
  if (!startNode || !endNode) return;
  return [startNode[0], start - startNode[1], endNode[0], end - endNode[1]] as [
    Node,
    number,
    Node,
    number
  ];
}
