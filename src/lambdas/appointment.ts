import { APIGatewayProxyHandler } from 'aws-lambda';
import { AppointmentService } from '../domain/services/AppointmentService';
import { DynamoDBRepository } from '../infrastructure/db/DynamoDBRepository';
import { SNSService } from '../infrastructure/messaging/SNSService';
import { Appointment } from '../domain/models/Appointment';

// Crear una instancia de SNSService (opcional) si la necesitas
const snsService = new SNSService();  // Si no lo necesitas, puedes dejarlo como null o no pasarlo

const appointmentService = new AppointmentService(
  new DynamoDBRepository(),   // Repositorio DynamoDB
  snsService                 // Pasar SNSService si es necesario
);
/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Agendar una cita
 *     description: Agrega una nueva cita a la base de datos.
 *     operationId: createAppointment
 *     requestBody:
 *       description: Información de la cita
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               insuredId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               doctorId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum:
 *                   - pending
 *                   - completed
 *     responses:
 *       200:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Parámetros inválidos
 * /appointments/{insuredId}:
 *   get:
 *     summary: Obtener citas de un asegurado
 *     description: Recupera las citas agendadas de un asegurado.
 *     operationId: getAppointments
 *     parameters:
 *       - name: insuredId
 *         in: path
 *         required: true
 *         description: ID del asegurado.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de citas
 *       404:
 *         description: No se encontraron citas
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log({event});
    // Obtener el cuerpo de la solicitud
    let requestBody = JSON.parse(event.body || '{}');
    if (requestBody == '{}' ) requestBody = event ;
    const { insuredId, scheduleId, countryISO } = requestBody;

    // Crear la cita
    const appointment: Appointment = {
      insuredId,
      scheduleId,
      countryISO,
      status: 'pending',
      // Otros atributos según el modelo Appointment
    };

    console.log({appointment});

    // Guardar la cita en DynamoDB
    await appointmentService.createAppointment(appointment);

    // Si SNSService está disponible, publicamos el mensaje
    if (snsService) {
      await snsService.send(appointment);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cita agendada correctamente y en proceso',
        status: 'pending',
      }),
    };
  } catch (error) {
    console.error('Error al agendar cita:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error interno al procesar la solicitud',
        error: error.message,
      }),
    };
  }
};