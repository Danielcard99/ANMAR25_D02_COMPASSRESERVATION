//import { Space } from '../../space/entities/space.entity';
//import { User } from '../../user/entities/user.entity';
import { ReservationResource } from "./reservation-resource.entity";

export enum ReservationStatus {
  OPEN = 'OPEN',
  APPROVED = 'APPROVED',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
}

export class Reservation {
  id: string;
  userId: string;
  //user: User;
  spaceId: string;
  //space: Space;
  startDate: Date;
  endDate: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  reservationResources: ReservationResource[];
}