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

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Obtener el cuerpo de la solicitud
    const requestBody = JSON.parse(event.body || '{}');
    const { insuredId, scheduleId, countryISO } = requestBody;

    // Crear la cita
    const appointment: Appointment = {
      insuredId,
      scheduleId,
      countryISO,
      status: 'pending',
      // Otros atributos según el modelo Appointment
    };

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