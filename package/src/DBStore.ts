import DBSToreIndex from "./DBStoreIndex";
import IDbError from "./DBError";
import type { AsyncDBCallback, IEvent } from "./types";

export default class DBStore<T> {
  public name: string;
  private options?: IDBObjectStoreParameters | undefined;
  private indexes: DBSToreIndex[];
  private db!: IDBDatabase;
  constructor(name: string, options?: IDBObjectStoreParameters) {
    this.name = name;
    this.options = options;
    this.indexes = [];
  }
  setDB(db: IDBDatabase) {
    this.db = db;
  }

  add(data: T) {
    return new Promise((res, rej) => {
      const transaction = this.db.transaction(this.name, "readwrite");
      const s = transaction.objectStore(this.name);
      const result = s.add(data);
      (result.onerror as AsyncDBCallback) = (e: IEvent) => {
        const message = e.target.error?.message;
        transaction.commit();
        rej(new IDbError(message, e));
      };
      (result.onsuccess as AsyncDBCallback) = () => {
        transaction.commit();
        res(true);
      };
    });
  }

  get(query: IDBValidKey | IDBKeyRange): Promise<T> {
    return new Promise((res, rej) => {
      const transaction = this.db.transaction(this.name, "readwrite");
      const s = transaction.objectStore(this.name);
      const result = s.get(query);
      (result.onerror as AsyncDBCallback) = (e: IEvent) => {
        const message = e.target.error?.message;
        transaction.commit();
        rej(new IDbError(message, e));
      };
      (result.onsuccess as AsyncDBCallback) = (e: IEvent) => {
        transaction.commit();
        res(e.target.result as T);
      };
    });
  }

  getAll(
    query?: IDBValidKey | IDBKeyRange | null | undefined,
    count?: number,
  ): Promise<T[]> {
    return new Promise((res, rej) => {
      const transaction = this.db.transaction(this.name, "readwrite");
      const s = transaction.objectStore(this.name);
      const result = s.getAll(query, count);
      (result.onerror as AsyncDBCallback) = (e: IEvent) => {
        const message = e.target.error?.message;

        transaction.commit();
        rej(new IDbError(message, e));
      };
      (result.onsuccess as AsyncDBCallback) = (e: IEvent) => {
        transaction.commit();
        res(e.target.result as unknown as T[]);
      };
    });
  }

  getKey(query: IDBValidKey | IDBKeyRange): Promise<T> {
    return new Promise((res, rej) => {
      const transaction = this.db.transaction(this.name, "readwrite");
      const s = transaction.objectStore(this.name);
      const result = s.getKey(query);
      (result.onerror as AsyncDBCallback) = (e: IEvent) => {
        const message = e.target.error?.message;

        transaction.commit();
        rej(new IDbError(message, e));
      };
      (result.onsuccess as AsyncDBCallback) = (e: IEvent) => {
        transaction.commit();
        res(e.target.result as T);
      };
    });
  }

  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null | undefined,
    count?: number,
  ): Promise<T[]> {
    return new Promise((res, rej) => {
      const transaction = this.db.transaction(this.name, "readwrite");
      const s = transaction.objectStore(this.name);
      const result = s.add(query, count);
      (result.onerror as AsyncDBCallback) = (e: IEvent) => {
        const message = e.target.error?.message;

        transaction.commit();
        rej(new IDbError(message, e));
      };
      (result.onsuccess as AsyncDBCallback) = (e: IEvent) => {
        transaction.commit();
        res(e.target.result as unknown as T[]);
      };
    });
  }

  update<K = T>(value: K, key?: IDBValidKey): Promise<T> {
    return new Promise((res, rej) => {
      const transaction = this.db.transaction(this.name, "readwrite");
      const s = transaction.objectStore(this.name);
      const result = s.put(value, key);
      (result.onerror as AsyncDBCallback) = (e: IEvent) => {
        const message = e.target.error?.message;
        transaction.commit();
        rej(new IDbError(message, e));
      };
      (result.onsuccess as AsyncDBCallback) = (e: IEvent) => {
        transaction.commit();
        res(e.target.result as T);
      };
    });
  }

  addIndex(
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters,
  ) {
    const index = new DBSToreIndex(name, keyPath, options);
    this.indexes.push(index);
  }
  getIndexes() {
    return this.indexes;
  }
  getOptions() {
    return this.options;
  }
}
