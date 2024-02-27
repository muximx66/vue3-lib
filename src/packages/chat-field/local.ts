
/** 捕获异常 */
export const catcheError = (fn: any) => {
  try {
    return [fn && fn(), null]
  } catch (err: any) {
    console.warn('Uncaugth (in chatLocal):', err)
    return [null, err]
  }
}

/** 设置本地值 */
export const set = (key: string, value: any) => {
  const [, err] = catcheError(() => window.localStorage.setItem(key, value))
  return !err;
}

/** 获取本地值 */
export const get = (key: string) => {
  const [res, err] = catcheError(() => window.localStorage.getItem(key))
  return err ? undefined : res;
}

/** 移除本地属性值 */
export const remove = (key: string) => {
  const [, err] = catcheError(() => window.localStorage.removeItem(key))
  return !err;
}

/** 清空本地内容 */
export const clear = () => {
  const [, err] = catcheError(() => window.localStorage.clear);
  return !err;
}

type DataMap<T> = Map<string, T[]>;

type UniqueMap = Map<string, string>

type LocalReturn<T> = [T[], UniqueMap]
/** 缓存 */
type Cache<T> = {
  dataMap: DataMap<T>;
  /** <unique,index> */
  uniqueMap: UniqueMap;
}


/** 添加方向 */
export enum DIRECTION {
  BEFORE = 'before',
  AFTER = 'after'
}

/** 本地 */
export class ChatLocal<T> {
  /** 缓存 */
  cache: Cache<T>
  /** 唯一值key */
  private uniqueKey: string;
  setUniqueKey(uniqueKey: string) {
    this.uniqueKey = uniqueKey;
  }
  /** 本地前缀key */
  private localPrefixKey: string;
  setLocalPrefixKey(localPrefixKey: string) {
    this.localPrefixKey = localPrefixKey
  }
  /** 本地储存键 */
  localKey(unique: string) { return this.localPrefixKey + unique }
  constructor(uniqueKey: string, LocalPrefixKey: string) {
    this.cache = {
      dataMap: new Map(),
      uniqueMap: new Map(),
    }
    this.uniqueKey = uniqueKey;
    this.localPrefixKey = LocalPrefixKey
  }
  /** 获取缓存 */
  get(key: string, updateUniques = true) {
    const { dataMap, uniqueMap } = this.cache;
    let data = dataMap.get(key) as T[];
    if (data?.length && !uniqueMap.size) this.updateUniques(key);
    if (data) return [data, this.cache.uniqueMap] as LocalReturn<T>
    return this.set(key, get(key) || [], updateUniques = true)
  }
  /** 设置缓存 */
  set(key: string, value: T[], updateUniques = true) {
    const { dataMap } = this.cache
    dataMap.set(key, value)
    set(this.localKey(key), value)
    updateUniques && this.updateUniques(key);
    return [value, this.cache.uniqueMap] as LocalReturn<T>
  }
  /** 同步uniques */
  updateUniques(key: string) {
    const { cache, uniqueKey } = this;
    const [data] = this.get(key, false)
    return (cache.uniqueMap = new Map(data.map((v, i) => [v[uniqueKey] as string, String(i)])));
  }
}

/** 本地实例 */
export const local = new ChatLocal('id', 'local');

/** 设置配置 */
export const useLocalConfig = <T>(uniqueKey = 'id', localPrefixKey = 'local') => {
  local.setUniqueKey(uniqueKey)
  local.setLocalPrefixKey(localPrefixKey)
  return local as ChatLocal<T>;
}

/** 设置/获取本地数据 */
export const useLocalData = <T>(key: string, data?: T[]) => {
  if (data) {
    return local.set(key, data) as LocalReturn<T>;
  }
  return local.get(key) as LocalReturn<T>;
}

/** 根据方向 获取 本地数据 */
export const useLocalDataByDirection = <T>(
  key: string,
  newData: (T[]) | undefined,
  relativeUnique = '',
  size = 20,
  direction = DIRECTION.BEFORE,
) => {
  return direction === DIRECTION.BEFORE
    ? useBeforeLocalData(key, newData, relativeUnique, size)
    : useAfterLocalData(key, newData, relativeUnique, size)
}

/** 设置/获取 首部数据 */
export const useBeforeLocalData = <T>(
  key: string,
  newData: (T[]) | undefined,
  relativeUnique = '',
  size = 20,
) => {
  const [data, uniqueMap] = useLocalData(key) as LocalReturn<T>
  const getRelativeIndex = () => Number((uniqueMap.get(relativeUnique) || -1))
  // 设置
  if (newData) {
    // 直接设置
    if (!relativeUnique) {
      return useLocalData(key, newData)
    }
    // 根据相对id获取数据
    const index = getRelativeIndex();
    // 未查询到相对id数据
    if (index < 0) {
      console.warn('uncaugth (in useBeforeLocalData)：set before error')
      return []
    }
    // 找到了，获取需要更新的数据
    newData = newData.slice(0, Math.max(newData.length - index, 0))
    if (newData.length) useLocalData(key, [...newData, ...data])
    return newData;
  }
  // 获取
  // 无相对id，直接获取后size个
  if (!relativeUnique) {
    return data.slice(Math.max(data.length - size));
  }
  // 有相对id，根据相对id获取数据
  const index = getRelativeIndex();
  // 未获取到，返回空
  if (index < 0) {
    return [];
  }
  // 获取相对index位置size个
  return data.slice(Math.max(index - size, 0), index)
}

/** 设置/获取 尾部数据 */
export const useAfterLocalData = <T>(
  key: string,
  newData: (T[]) | undefined,
  relativeUnique = '',
  size = 20,
) => {
  const [data, uniqueMap] = useLocalData(key) as LocalReturn<T>
  // 直接获取后size个
  if (!relativeUnique) {
    return data.slice(Math.max(data.length - size));
  }
  // 根据相对id获取数据
  let index = Number((uniqueMap.get(relativeUnique) || -1))
  // 设置
  if (newData) {
    // 未查询到相对id
    if (index < 0) {
      // 未找到设置的位置
      console.warn('uncaugth (in useBeforeLocalData)：set before error')
      return []
    }
    // 获取需要更新的数据
    newData = newData.slice(0, Math.max(newData.length - index, 0))
    if (newData.length) useLocalData(key, [...newData, ...data])
    return newData;
  }
  // 获取
  // 未获取到
  if (index < 0) {
    return [];
  }
  // 获取相对index位置size个
  return data.slice(Math.max(index - size, 0), index)
}