import { ISearchDTO } from './search.dto';

export interface ISessionCreateDTO {
  email: string;
  password: string;
}

export interface ISessionResponseDTO {
  id: string;
}

export interface ISessionSearchDTO extends ISearchDTO<ISessionSearchDTO> {
  accountId?: string;
  createdAt?: Date;
  deletedAt?: Date;
}

