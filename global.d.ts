import { AccountType } from '@/user/const/account-type.const';

declare global {
  type Session = {
    id: number;
    email: string;
    nickname: string;
    accountType: AccountType;
    createdAt: Date;
    updatedAt: Date;
  };
}
