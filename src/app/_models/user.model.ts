export class User {
  id!: string;
  email!: string;
  userName!: string;
  fullName!: string;
  userRoles?: string[];
  jwtToken!: string;
  refreshToken?: string;
}
