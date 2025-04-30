//import { Resource } from '../../resource/entities/resource.entity';
import { Reservation } from './reservation.entity';

export class ReservationResource {
  id: string;
  reservationId: string;
  reservation: Reservation;
  resourceId: string;
  //resource: Resource;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}