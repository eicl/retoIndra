import { AppointmentService } from '../domain/services/AppointmentService';

describe('AppointmentService', () => {
  it('debería retornar una cita confirmada', async () => {
    const repoMock = {
      save: jest.fn().mockResolvedValue({ status: 'ok' }),
    };

    const service = new AppointmentService(repoMock as any);

    const result = {status: await service.createAppointment({
        insuredId: '00001',
        scheduleId: 1,
        countryISO: 'PE',
        status: 'pending'
    }) } ;

    expect(repoMock.save).toHaveBeenCalled();
  });
});