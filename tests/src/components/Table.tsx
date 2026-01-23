import type { UserSchema } from "../utils/types";

type Props = {
  users: UserSchema[];
  editHandler: (user: UserSchema) => void;
  deleteHandler: (user: UserSchema) => void;
};
export default function Table({ users, editHandler, deleteHandler }: Props) {
  return (
    <table className="table-auto border">
      <thead>
        <tr className="font-bold text-2xl border">
          <td className="border p-2">ID</td>
          <td className="border p-2">Name</td>
          <td className="border p-2">Email</td>
          <td className="border p-2">Hight</td>
          <td className="border p-2">Birthday</td>
          <td className="border p-2">Action</td>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border p-2">{user.id}</td>
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">{user.height}</td>
            <td className="border p-2">{user.birthday.toDateString()}</td>
            <td className="border p-2 flex gap-3">
              <button className="button " onClick={() => editHandler(user)}>
                Edit
              </button>
              <button
                className="bg-red-500!"
                onClick={() => deleteHandler(user)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
