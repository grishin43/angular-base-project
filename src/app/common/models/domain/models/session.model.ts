import {IAccountModel} from './account.model';
import {IAccountRoleModel} from './accountRole.model';

export interface ISession {
  id: string;
  accountId: string;
  roleId: string;
  createdAt: Date;
}

export interface ISessionModel extends ISession {
  account?: IAccountModel;
  role?: IAccountRoleModel;
}
