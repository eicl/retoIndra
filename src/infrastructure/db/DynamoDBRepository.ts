import { DynamoDB } from 'aws-sdk';
import { Appointment } from '../../domain/models/Appointment';
import { AppointmentRepository } from '../../domain/interfaces/AppointmentRepository';
import { Env } from '../../config/env';

export class DynamoDBRepository implements AppointmentRepository {
  private client: DynamoDB.DocumentClient;
  private tableName: string;

  constructor() {
    this.client = new DynamoDB.DocumentClient();
    this.tableName = Env.DYNAMODB_TABLE;
  }

  // Crear un nuevo registro de cita
  async save(appointment: Appointment): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: appointment,
    };

    await this.client.put(params).promise();
  }

  // Obtener todas las citas por código de asegurado
  async getByInsuredId(insuredId: string): Promise<Appointment[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    };

    const result = await this.client.query(params).promise();
    return result.Items as Appointment[];
  }

  // Actualizar estado de la cita (a 'completed')
  async updateAppointmentStatus(insuredId: string, status: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { insuredId },
      UpdateExpression: 'SET #s = :status',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
      },
    };

    await this.client.update(params).promise();
  }
}

