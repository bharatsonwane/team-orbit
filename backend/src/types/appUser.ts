export interface AppUser {
  id?: number | null;
  title: string;
  firstName: string;
  lastName: string;
  middleName: string;
  maidenName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  marriedStatus: string;
  email: string;
  phone: string;
  password: string;
  bio: string;
  userStatus: string;
  tenantId: number;
  userRoles: number[];
}
