export interface ISubscriber {
  id: string;
  isVerified: boolean;
  username: string;
  chatId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ISubscriberModel extends ISubscriber {
}
