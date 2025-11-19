
export interface Account {
  accountId: number;
  email: string | null;
  phone: string;
  role: string;
  address: string | null;
  status: AccountStatus;
}

export interface AccountDetail {
  accountId: number;
  email: string | null;
  phone: string;
  role: string;
  address: string | null;
  status: AccountStatus;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  dob: string | null;
}

export const AccountStatus = {
  Inactive: 0,
  Active: 1,
} as const;

export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];