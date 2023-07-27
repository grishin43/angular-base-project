export enum EFilterOperations {
  eq= 'eq',
  ne = 'ne',
  gte = 'gte',
  lte = 'lte',
}

export const FilterOperationsObject = {
  [EFilterOperations.eq]: '=',
  [EFilterOperations.ne]: '<>',
  [EFilterOperations.gte]: '>',
  [EFilterOperations.lte]: '<',
}

export enum ESortOperations {
  asc= 'asc',
  desc = 'desc'
}

export type DTOFilterAttribute<T> = {
  [key in keyof T]: { -readonly [opt in keyof typeof EFilterOperations]: T[key] } | Array<T[key]> | T[key]
}

export type DTOSortAttribute<T> = {
  [key in keyof T]: ESortOperations
}

export interface ISearchDTO<T> {
  filter?: DTOFilterAttribute<T> | { [key: string]: string };
  sort?: DTOSortAttribute<T>;
  text?: string;
  /** Only for classic pagination */
  skip?: string;
  /**  Only for classic pagination */
  take?: string;
  /** Only for cursor pagination */
  next?: string;
  /** Only for cursor pagination */
  prev?: string;
}

export interface ISearchResponseDTO<T> {
  rows: T[];
  count: number;
}

export interface ISearchCursorResponseDTO<T> {
  rows: T[];
  count: number;
  next?: string;
  prev?: string;
}
