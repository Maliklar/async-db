import DBStore from "./DBStore";
import IDbError from "./DBError";
import type { IDbAsync } from "./types";

export default class AsyncDB {
  private static openReq: IDbAsync;
  private static db: IDBDatabase;
  private static dbName: string;
  private static version?: number;
  private static stores: DBStore<any>[];

  public static open(dbName: string, version?: number) {
    this.dbName = dbName;
    this.version = version;
    this.stores = [];
    return this;
  }

  public static addStore<T>(store: DBStore<T>) {
    this.stores.push(store);
    return this;
  }

  public static createStore<T>(
    name: string,
    options?: IDBObjectStoreParameters,
  ) {
    return new DBStore<T>(name, options);
  }

  public static async build(): Promise<IDBDatabase> {
    this.openReq = window.indexedDB.open(this.dbName, this.version) as IDbAsync;
    return new Promise((res, rej) => {
      this.openReq.onerror = (e) => {
        rej(new IDbError(e.target.error?.message, e));
      };
      this.openReq.onsuccess = (e) => {
        this.db = e.target.result;
        for (const store of this.stores) {
          store.setDB(this.db);
        }
        res(this.db);
      };
      this.openReq.onupgradeneeded = (e) => {
        this.db = e.target.result;
        for (const store of this.stores) {
          const s = this.db.createObjectStore(store.name, store.getOptions());
          const indexes = store.getIndexes();
          for (const index of indexes) {
            const name = index.name;
            const keyPath = index.keyPath;
            const options = index.options;
            s.createIndex(name, keyPath, options);
          }
        }
      };
      this.openReq.onblocked = (e) => {
        rej(new IDbError(e.target.error?.message, e));
      };
    });
  }
}
