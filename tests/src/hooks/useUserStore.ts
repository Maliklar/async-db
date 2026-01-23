import AsyncDB, { DBStore } from "browser-async-db";
import { useEffect, useRef, useState } from "react";
import { DB_NAME, userStoreOptions } from "../utils/constants";
import { type User, type UserSchema } from "../utils/types";

export default function useUserStore() {
  const [userStore, setUserStore] = useState<DBStore<UserSchema>>();
  const [users, setUsers] = useState<UserSchema[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    const { name, options } = userStoreOptions;
    async function init() {
      const db = AsyncDB.init(DB_NAME, 3);
      const userStore = db.createStore<UserSchema>(name, options);
      await db.build();

      const users = await userStore.getAll();
      setUserStore(userStore);
      setUsers(users);
      initialized.current = true;
    }

    init();
  }, []);

  async function add(user: User) {
    if (!userStore) throw new Error("Async DB is not initialized");
    await userStore.add(user as UserSchema);
    const users = await userStore.getAll();
    setUsers(users);
  }
  async function update(user: User) {
    if (!userStore) throw new Error("Async DB is not initialized");
    await userStore.update(user);
    const users = await userStore.getAll();
    setUsers(users);
  }

  async function remove(id: number) {
    if (!userStore) throw new Error("Async DB is not initialized");
    await userStore.delete(id);
    const users = await userStore.getAll();
    setUsers(users);
  }

  return { add, update, remove, userStore, users };
}
