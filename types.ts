
export interface Passenger {
  fullName: string;
  passportNumber: string;
}

export interface Seat {
  seat_number: string;
  is_booked: boolean;
  passenger_name: string | null;
  passport_number: string | null;
  booked_at?: string;
  ticket_id?: string;
}

export enum BookingStep {
  IDLE = 'IDLE',
  DETAILS = 'DETAILS',
  PAYMENT = 'PAYMENT',
  SUCCESS = 'SUCCESS'
}

export const ROUTE_INFO = {
  from: 'Toshkent',
  to: 'Navoiy',
  departureTime: '21:00',
  price: 120000
};
