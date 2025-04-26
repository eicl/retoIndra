import { Appointment } from '../models/Appointment';
import { AppointmentRepository } from '../interfaces/AppointmentRepository';
import { SNSService } from '../../infrastructure/messaging/SNSService';

export class AppointmentService {

    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly snsService?: SNSService // ← la interrogación lo hace opcional
      ) {}

  async createAppointment(appointment: Appointment) {
    // Guardar en DynamoDB
    await this.appointmentRepository.save(appointment);

    if (this.snsService) {
    // Enviar mensaje a SNS según el país
    await this.snsService.send(appointment);
    }
  }

  async getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]> {
    return this.appointmentRepository.getByInsuredId(insuredId);
  }

  async updateAppointmentStatus(insuredId: string, status: string): Promise<void> {
    await this.appointmentRepository.updateAppointmentStatus(insuredId, status);
  }
}
