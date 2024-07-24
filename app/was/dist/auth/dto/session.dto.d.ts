import { AccountType } from '@/user/const/account-type.const';
import { StatusEnum } from '@/user/const/status.const';
export declare class SessionDto {
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
