import { SNS } from 'aws-sdk';
import { Appointment } from '../../domain/models/Appointment';
import { Env } from '../../config/env';

export class SNSService {
  private sns: SNS;

  constructor() {
    this.sns = new SNS();
  }

  async send(appointment: Appointment): Promise<void> {
    const topicArn = this.getTopicArnByCountry(appointment.countryISO);

    if (!topicArn) {
      console.warn(`No SNS Topic ARN found for country: ${appointment.countryISO}`);
      return;
    }

    const params = {
      Message: JSON.stringify(appointment),
      TopicArn: topicArn,
    };

    await this.sns.publish(params).promise();
  }

  private getTopicArnByCountry(countryISO: string): string | null {
    const topicMap: Record<string, string> = {
      PE: Env.SNS_TOPIC_PE || '',
      CL: Env.SNS_TOPIC_CL || '',
    };

    return topicMap[countryISO] || null;
  }
}
