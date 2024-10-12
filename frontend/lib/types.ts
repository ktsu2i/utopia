export type User = {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  createdAt: string,
  updatedAt: string,
}

export type TestType = {
  users: User[]
};