import { Link } from "react-router";
import "../App.css";
import Table from "../components/Table";
import useUserStore from "../hooks/useUserStore";
import type { User, UserSchema } from "../utils/types";
import { faker } from "@faker-js/faker";

export default function HomePage() {
  const { users, add, remove, update } = useUserStore();
  console.log(users);
  async function createUserHandler() {
    const user: Omit<User, "id"> = {
      name: faker.person.fullName(),
      birthday: faker.date.birthdate(),
      email: faker.internet.email(),
      height: faker.number.int({ min: 130, max: 200 }),
    };
    await add(user);
  }

  async function deleteHandler(user: UserSchema) {
    await remove(user.id);
  }
  async function editHandler(user: UserSchema) {
    const updatedUser = {
      ...user,
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
    await update(updatedUser);
  }
  return (
    <div className="flex flex-col gap-5">
      <h1>Home Page</h1>
      <Link to="/add-user">Add New User</Link>

      <button onClick={createUserHandler}>Add User</button>

      <Table
        users={users}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
      />
    </div>
  );
}
