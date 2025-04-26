import mysql from 'mysql2/promise';
import { Appointment } from '../../domain/models/Appointment';
import { AppointmentRepository } from '../../domain/interfaces/AppointmentRepository';
import { Env } from '../../config/env';


const connectionConfig = {
  host: Env.RDS_HOST,
  user: Env.RDS_USER,
  password: Env.RDS_PASSWORD,
  database: Env.RDS_DATABASE,
};

export class MySQLRepository implements AppointmentRepository {
  // Guardar una nueva cita
  async save(appointment: Appointment): Promise<void> {
    const connection = await mysql.createConnection(connectionConfig);

    const query = `
      INSERT INTO appointments 
        (insured_id, schedule_id, country_iso, status) 
      VALUES (?, ?, ?, ?)
    `;

    await connection.execute(query, [
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO,
      appointment.status,
    ]);

    await connection.end();
  }

  // Obtener citas por insuredId (opcional si lo usas desde RDS)
  async getByInsuredId(insuredId: string): Promise<Appointment[]> {
    const connection = await mysql.createConnection(connectionConfig);

    const [rows] = await connection.execute(
      `SELECT * FROM appointments WHERE insured_id = ?`,
      [insuredId]
    );

    await connection.end();
    return rows as Appointment[];
  }

  // Actualizar estado por insuredId
  async updateAppointmentStatus(insuredId: string, status: string): Promise<void> {
    const connection = await mysql.createConnection(connectionConfig);

    const query = `
      UPDATE appointments 
      SET status = ? 
      WHERE insured_id = ?
    `;

    await connection.execute(query, [status, insuredId]);
    await connection.end();
  }
}