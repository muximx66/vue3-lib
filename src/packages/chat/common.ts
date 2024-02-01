/** 校验格式 */
export const validPasteType=(type:string)=>{
  return type.startsWith('image/')
    ||['text/plain','application/x-zip-compressed'].includes(type)
    ||type.indexOf('officedocument')>-1
}

