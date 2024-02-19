/** 文件管理 */
export class FileManager {
  files:Map<string,Blob>=new Map();
  set(id:string,file:Blob){
    this.files.set(id,file);
  }
  get(id:string){
    return this.files.get(id);
  }
  has(id:string){
    return !!this.get(id)
  }
  delete(id:string){
    this.files.delete(id);
  }
  clear(){
    this.files.clear();
  }
}

export const fileManager=new FileManager();