import { EventBridge } from 'aws-sdk';
import { Appointment } from '../../domain/models/Appointment';

export class EventBridgeService {
  private eventBridge = new EventBridge();

  async sendAppointmentConfirmation(appointment: Appointment) {
    const params = {
      Entries: [
        {
          Source: 'appointment',
          DetailType: 'appointment-success',
          Detail: JSON.stringify(appointment),
          EventBusName: process.env.EVENT_BUS_NAME, 
        },
      ],
    };

    await this.eventBridge.putEvents(params).promise();
    console.log('Evento enviado a EventBridge para confirmación de agendamiento.');
  }
}
