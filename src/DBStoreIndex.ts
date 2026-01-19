export default class DBStoreIndex {
  name: string;
  keyPath: string | string[];
  options?: IDBIndexParameters;
  constructor(
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters,
  ) {
    this.name = name;
    this.keyPath = keyPath;
    this.options = options;
  }
}
