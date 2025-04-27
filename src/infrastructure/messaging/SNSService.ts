import { SNS } from 'aws-sdk';
import { Appointment } from '../../domain/models/Appointment';
import { Env } from '../../config/env';


export class SNSService {
  private sns: SNS;

  constructor() {
    this.sns = new SNS();
  }

  async send(appointment: Appointment): Promise<void> {
    const topicArn = await this.getTopicArnByCountry(appointment.countryISO);
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
 
  async getTopicArnByCountry(countryISO: string):Promise<string | null> {
    let topicMap: string | null = '';
     switch (countryISO ){
      case 'PE':
        topicMap = '' + Env.SNS_ARN_PE ;
        break;
      case 'CL':
        topicMap = '' + Env.SNS_ARN_CL;
        break;
      default :
        topicMap = null;
        break;
     }
    return topicMap;
  }
}
