import { SNS } from 'aws-sdk';
import { Appointment } from '../../domain/models/Appointment';
require('dotenv').config();


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
    const key:string = 'SNS_TOPIC_PE';
    let topicMap: string | null = '';
     switch (countryISO ){
      case 'PE':
        topicMap = 'arn:aws:sns:us-east-1:969510159188:SNS_PE' ;
        console.log( "topic_peru","" + process.env[key])
        break;
      case 'CL':
        topicMap = '' +  process.env["SNS_TOPIC_CL"];
        break;
      default :
        topicMap = null;
        break;
     }
    console.log('topic', topicMap)
    return topicMap;
  }
}
