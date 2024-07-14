import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';

export class SessionDto {
  id: number;
  email: string;
  avatar: string | null;
  nickname: string;
  accountType: AccountType;
  level: number;
  status: StatusEnum;
  createdAt: Date;
  updatedAt: Date;
}
