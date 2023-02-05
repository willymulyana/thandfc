import { Appointment } from "@/entities/Appointment"
import { Doctor } from "@/entities/Doctor"
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput"
import { faker } from "@faker-js/faker"
import { addDays, addMinutes, nextMonday, setHours, setMinutes } from "date-fns"
import { anything, instance, mock, verify, when } from "ts-mockito"
import { Repository } from "typeorm"
import { AppointmentService } from "./AppointmentService"


describe('AppointmentService', () => {
  let sut: AppointmentService;
  let mockAppointmentRepo: Repository<Appointment>;
  let mockDoctorRepo: Repository<Doctor>;

  beforeEach(() => {
    mockAppointmentRepo = mock(Repository);
    mockDoctorRepo = mock(Repository)
    sut = new AppointmentService(instance(mockAppointmentRepo), instance(mockDoctorRepo));
  });

  describe('bookAppointment', () => {
    it('should not book duplicate appointment', async () => {
      const doctor = new Doctor();
      doctor.id = 1;

      const appointment = new Appointment()

      // set appointment start time to next monday at 2pm
      const startTime = setMinutes(setHours(addDays(nextMonday(new Date()), 1), 14), 0);
      appointment.startTime = startTime;
      appointment.durationMinutes = 15;
      appointment.doctor = doctor;
      doctor.appointments = [appointment];

      when(mockDoctorRepo.findOne(anything(),anything())).thenResolve(doctor);

      const bookAppointmentInput: BookAppointmentInput = {
        slot: { start: startTime, end: addMinutes(startTime, 15), doctorId: doctor.id },
        patientName: faker.name.firstName(),
        description: faker.lorem.lines(1),
      };

      const call = async () => {
        await sut.bookAppointment(bookAppointmentInput);
        verify(mockDoctorRepo.findOne(anything(), anything())).called();
      }

      expect(call).rejects.toThrow("Appointment slot already taken");
    });
  });
});