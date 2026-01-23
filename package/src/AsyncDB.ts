import IDbError from "./DBError";
import DBStore from "./DBStore";
import type {
  AsyncDBDatabase,
  AsyncDBInstance,
  IDbAsync,
  StoreMap,
} from "./types";

export default class AsyncDB {
  private openReq!: IDbAsync;
  private db!: AsyncDBDatabase;
  private dbName: string;
  private version?: number;
  private stores: Map<string, DBStore<unknown>>;

  private constructor(dbName: string, version?: number) {
    this.dbName = dbName;
    this.version = version;
    this.stores = new Map<string, DBStore<unknown>>();
  }

  public static init(dbName: string, version?: number) {
    return new AsyncDB(dbName, version);
  }

  public createStore<T>(name: string, options?: IDBObjectStoreParameters) {
    const store = new DBStore<T>(name, options);
    this.stores.set(name, store);
    return store;
  }

  public async build(): Promise<AsyncDBInstance> {
    return new Promise((res, rej) => {
      this.openReq = window.indexedDB.open(
        this.dbName,
        this.version,
      ) as IDbAsync;
      this.openReq.onerror = (e) => {
        rej(new IDbError(e.target.error?.message, e));
      };

      this.openReq.onsuccess = (e) => {
        this.db = e.target.result as AsyncDBDatabase;
        const entries = this.stores.entries();
        for (const [_, store] of entries) store.setDB(this.db);

        res({
          db: this.db,
          dbName: this.dbName,
          openReq: this.openReq,
          version: this.version,
        });
      };

      this.openReq.onupgradeneeded = (e) => {
        this.db = e.target.result as AsyncDBDatabase;
        for (const store of this.stores.values()) {
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
