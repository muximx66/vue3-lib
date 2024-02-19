import { type IFilterXSSOptions, FilterXSS } from "xss";
import { ATTRS_PREFIX } from './enum'
import { getElemAttribute } from './helper'
import { fileManager } from './file'

/** 需要删除的标签列表 */
const removeTags = [
  "script",
  "video",
  "audio",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  'u',
  'b',
  'i',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'table',
  'tr',
  'td',
  'th',
  'tbody',
  'thead',
  'tfoot',
  "iframe",
  "svg",
  "button",
  "object",
  "blockquote",
  "form",
  "html",
  "body",
  "head",
  "meta",
  "link",
  "title",
  "style",
  "code",
  "pre",
];

/** 清空标签中文本 */
const removeBodyTags = ["script", "video", "audio", "iframe", "svg", "object", "img"];

/** 过滤图片 */
const imgFilter = (html: string) => {
  const el = document.createElement('div');
  el.innerHTML = html;
  const img = el.querySelector('img');
  if (!img) return '';
  const id = getElemAttribute(img, `${ATTRS_PREFIX}id`);
  if (!id) return '';
  if (!fileManager.has(id)) return '';
  return html;
}

/** 过滤配置 */
const options: IFilterXSSOptions = {
  /** 过滤标签内容 */
  stripIgnoreTagBody: removeBodyTags,
  /** 过滤标签 */
  onTag(tag, html) {
    // 过滤图片
    if (tag === 'img') return imgFilter(html);
    // 过滤标签
    if (removeTags.includes(tag)) {
      return "";
    }
  },
  /** 过滤属性 */
  onTagAttr(_tag, name, value) {
    console.log(name)
    if (name.startsWith(ATTRS_PREFIX)) return `${name}="${value}"`;
    return ''
  },
};

const filter = new FilterXSS(options)

export default filter.process.bind(filter);
