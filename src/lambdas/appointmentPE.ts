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
 * /appointments/pe:
 *   post:
 *     summary: Procesar citas para PE
 *     description: Esta función procesa los agendamientos de citas para el país PE.
 *     operationId: processPEAppointments
 *     responses:
 *       200:
 *         description: Cita procesada correctamente
 */
export const appointmentPE: SQSHandler = async (event: SQSEvent) => {
  // Procesar cada mensaje de la cola SQS
  for (const record of event.Records) {
    const appointmentData: Appointment = JSON.parse(record.body);
    console.log({appointmentData});
    // Si el país es Perú, realizamos el agendamiento
    if (appointmentData.countryISO === 'PE') {
      // Crear y guardar la cita médica
      appointmentData.status = 'in_process';
      await appointmentService.createAppointment(appointmentData);

      //  Enviar conformidad por EventBridge
      await eventBridgeService.sendAppointmentConfirmation(appointmentData);

      console.log(`Conformidad enviada por EventBridge para PE: ${appointmentData.insuredId}`);
      
    } else {
      console.log('País no correspondiente a Perú, mensaje ignorado.');
    }
  }
};

