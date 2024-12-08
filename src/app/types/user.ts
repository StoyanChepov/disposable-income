export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdOn: Date;
}

export interface UserForAuth {
  email: string;
  password: string;
}
