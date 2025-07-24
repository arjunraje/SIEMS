export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'Accountant' | 'Client';
}

export interface LoginDTO {
  email: string;
  password: string;
}
