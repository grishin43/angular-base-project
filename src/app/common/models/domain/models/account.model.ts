import {IAccountRoleModel} from './accountRole.model';
import {IAffiliateModel} from "./affiliate.model";
import {IBrandModel} from "./brand.model";
import {ICompany} from "./company.model";

export enum EAccountStatus {
  Active = 'active',
  Pending = 'pending',
  Paused = 'paused',
  Blocked = 'blocked'
}

export interface IAccount {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string; // front only
  status: EAccountStatus;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IAccountModel extends IAccount {
  roles?: IAccountRoleModel[];
  subscription?: {
    id: string;
  }
  affiliates?: IAffiliateModel[];
  brokers?: IBrandModel[];
  companies?: ICompany[]; // front only
  currentCompany?: ICompany; // front only
}
