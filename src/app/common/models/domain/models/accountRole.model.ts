import { IAccountModel } from './account.model';

export enum ETrackerModule {
  Company = 'company',
  VerticalTemplate = 'verticalTemplate',
  Account = 'account',
  Affiliate = 'affiliate',
  Box = 'box',
  Broker = 'broker',
  Integrator = 'integrator',
  Lead = 'lead',
}

export enum EAccountModuleResource {
  Base = 'base',
  Role = 'role',
}

export enum EAffiliateModuleResource {
  Base = 'base',
  Postback = 'postback',
}

export enum EBoxModuleResource {
  Base = 'base',
  AffiliateAttachment = 'affiliateAttachment',
  BrokerAttachment = 'brokerAttachment',
}

export enum EBrokerModuleResource {
  Base = 'base',
  Integration = 'integration',
}

export enum EIntegratorModuleResource {
  Base = 'base',
}

export enum EVerticalTemplateModuleResource {
  Base = 'base',
}

export enum ECompanyModuleResource {
  Base = 'base',
}

export enum ELeadModuleResource {
  Base = 'base',
  History = 'history',
  Inject = 'inject',
  Report = 'report',
}

export enum EAccountRoleType {
  Empty = 'empty',
  TrackerAdmin = 'trackerAdmin',
  TrackerMaster = 'trackerMaster',
  TrackerViewer = 'trackerViewer',
  SystemAdmin = 'systemAdmin',
  God = 'god'
}

export enum EPermissionAction {
  Create = 'c',
  Read = 'r',
  Update = 'u',
  Delete = 'd'
}

export enum EAccessType {
  Hook = 'hook',
  External = 'external',
  Free = 'free',
  Restricted = 'restricted',
}

export enum EPermissionLevel {
  Any = '*',
  Own = '@',
  None = '-'
}

export interface IPermissionBlock {
  [EPermissionAction.Create]: EPermissionLevel,
  [EPermissionAction.Read]: EPermissionLevel,
  [EPermissionAction.Update]: EPermissionLevel,
  [EPermissionAction.Delete]: EPermissionLevel,
}

export type RolePermissions = {[module: string]: {[resource: string]: IPermissionBlock}};

export interface IAccountRole {
  id: string;
  accountId: string;
  companyId?: string;
  type: EAccountRoleType;
  permissions: RolePermissions;
  createdAt: Date;
}

export interface IAccountRoleModel extends IAccountRole {
  account?: IAccountModel;
}
