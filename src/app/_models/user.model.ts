export class User {
  id!: string;
  email!: string;
  username!: string;
  fullName!: string;
  userRoles?: string[];
  jwtToken!: string;
  refreshToken?: string;
}
