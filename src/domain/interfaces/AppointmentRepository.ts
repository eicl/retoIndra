import { Appointment } from '../models/Appointment';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  getByInsuredId(insuredId: string): Promise<Appointment[]>;
  updateAppointmentStatus(insuredId: string, status: string): Promise<void>; 
}
