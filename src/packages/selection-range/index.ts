export const useSelection = (el: HTMLElement, start: number, end: number) => {
  const selection = document.getSelection();
  if (!selection || !el.firstChild) return;
  const range = document.createRange();
  range.setStart(el.firstChild, start);
  range.setEnd(el.firstChild, end);
  selection.removeAllRanges();
  selection.addRange(range);
}