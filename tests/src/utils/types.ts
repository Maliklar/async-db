export type UserSchema = {
  id: number;
  name: string;
  email: string;
  height: number;
  birthday: Date;
};
export type User = Omit<UserSchema, "id">;
