import { AccountType } from '@/user/const/account-type.const';

export class RefreshDto {
  id: number;
  email: string;
  accountType: AccountType;
  avatar?: string;
  nickname?: string;
}
