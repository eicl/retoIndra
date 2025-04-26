import { SQSHandler, SQSEvent } from 'aws-lambda';
import { DynamoDBRepository } from '../infrastructure/db/DynamoDBRepository';
import { AppointmentService } from '../domain/services/AppointmentService';
import { Appointment } from '../domain/models/Appointment';

const appointmentService = new AppointmentService(
  new DynamoDBRepository());

export const confirmAppointment: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const appointment: Appointment = JSON.parse(record.body);

    console.log(`Actualizando estado a COMPLETED para insuredId: ${appointment.insuredId}`);

    appointment.status = 'completed';
    await appointmentService.updateAppointmentStatus(appointment.insuredId, appointment.status);
  }
};
