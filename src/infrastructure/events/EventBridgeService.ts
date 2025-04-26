import { EventBridge } from 'aws-sdk';
import { Appointment } from '../../domain/models/Appointment';

export class EventBridgeService {
  private eventBridge = new EventBridge();

  async sendAppointmentConfirmation(appointment: Appointment) {
    const params = {
      Entries: [
        {
          Source: 'appointment.system',
          DetailType: 'AppointmentConfirmed',
          Detail: JSON.stringify(appointment),
          EventBusName: 'default', 
        },
      ],
    };

    await this.eventBridge.putEvents(params).promise();
  }
}
