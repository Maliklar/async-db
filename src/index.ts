/* eslint-disable @typescript-eslint/no-explicit-any */
import DBStore from "./DBStore";
import IDbError from "./DBError";
import type { IDbAsync } from "./types";

export default class BAsyncDB {
  public static openReq: IDbAsync;
  public static db: IDBDatabase;
  public static dbName: string;
  public static version?: number;
  public static stores: DBStore<any>[];
  public static storeNames: string[];

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
        const message = "IndexedDB Error: " + e.target.error?.message;
        rej(new IDbError(message, e));
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
          const s = this.db.createObjectStore(store.name, store.options);
          const indexes = store.indexes;
          for (const index of indexes) {
            const name = index.name;
            const keyPath = index.keyPath;
            const options = index.options;
            s.createIndex(name, keyPath, options);
          }
        }
      };
      this.openReq.onblocked = (e) => {
        const message = "IndexedDB Error: " + e.target.error?.message;
        rej(new IDbError(message, e));
      };
    });
  }
}
