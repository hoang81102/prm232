export interface Account {
  userId: number;
  email: string | null;
  phoneNumber: string;
  roleName: string;
  firstName: string | null;
  lastName: string | null;
  isActive: AccountStatus;
}

export interface AccountDetail {
  accountId: number;
  email: string | null;
  phoneNumber: string;
  password: string;
  role: string;
  address: string | null;
  status: AccountStatus;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
}

export const AccountStatus = {
  Inactive: false,
  Active: true,
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];
