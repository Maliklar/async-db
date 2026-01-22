export type IEvent = Event & {
  target: IDBOpenDBRequest;
};

export type StoreArgs = {
  name: string;
  options?: IDBObjectStoreParameters | undefined;
};

export type IndexArgs = {
  name: string;
  keyPath: string | string[];
  options?: IDBIndexParameters;
};

export type StoreArguments = {
  store: StoreArgs;
  indexes: IndexArgs[];
};

export type StringsToObject<T extends readonly string[]> = {
  [K in T[number]]: null;
};

export type AsyncDBCallback = ((ev: IEvent) => any) | null;

export interface IDbAsync {
  addEventListener(type: unknown, listener: unknown, options?: unknown): void;
  dispatchEvent(event: IEvent): boolean;
  error: DOMException | null;
  onblocked: AsyncDBCallback;
  onerror: AsyncDBCallback;
  onsuccess: AsyncDBCallback;
  onupgradeneeded: AsyncDBCallback;
  readyState: IDBRequestReadyState;
  removeEventListener(
    type: unknown,
    listener: unknown,
    options?: unknown,
  ): void;

  result: IDBDatabase;
  source: IDBObjectStore | IDBIndex | IDBCursor;
  transaction: IDBTransaction | null;
}
