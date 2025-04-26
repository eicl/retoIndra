import AWS from 'aws-sdk';

export class SQSService {
  private sqs = new AWS.SQS();

  async sendMessage(queueUrl: string, messageBody: string) {
    await this.sqs.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: messageBody,
    }).promise();
  }
}
