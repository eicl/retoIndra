import { SQSEvent, SQSHandler } from 'aws-lambda';
import { AppointmentService } from '../domain/services/AppointmentService';
import { MySQLRepository } from '../infrastructure/db/MySQLRepository';
import { SNSService } from '../infrastructure/messaging/SNSService';
import { Appointment } from '../domain/models/Appointment';
import { EventBridgeService } from '../infrastructure/events/EventBridgeService';

const appointmentService = new AppointmentService(
  new MySQLRepository(),
  new SNSService()
);
const eventBridgeService = new EventBridgeService();

/**
 * @swagger
 * /appointments/cl:
 *   post:
 *     summary: Procesar citas para CL
 *     description: Esta función procesa los agendamientos de citas para el país CL.
 *     operationId: processCLAppointments
 *     responses:
 *       200:
 *         description: Cita procesada correctamente
 */
export const appointmentCL: SQSHandler = async (event: SQSEvent) => {
  // Procesar cada mensaje de la cola SQS
  for (const record of event.Records) {
    const appointmentData: Appointment = JSON.parse(record.body);

    // Si el país es Chile, realizamos el agendamiento
    if (appointmentData.countryISO === 'CL') {
      // Crear y guardar la cita médica
      appointmentData.status = 'in_process';
      await appointmentService.createAppointment(appointmentData);

    // Enviar conformidad por EventBridge
    await eventBridgeService.sendAppointmentConfirmation(appointmentData);

    console.log(`Conformidad enviada por EventBridge para CL: ${appointmentData.insuredId}`);
    } else {
      console.log('País no correspondiente a Chile, mensaje ignorado.');
    }
  }
};
