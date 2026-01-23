import type { IEvent } from "./types";

export default class DBError extends Error {
  event?: IEvent;
  stack?: string | undefined;
  constructor(message: string | undefined, e?: IEvent) {
    super(message);
    this.message = `AsyncDB Error: ${message}`;
    this.event = e;
  }
}
