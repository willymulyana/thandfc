import { Appointment } from "@/entities/Appointment"
import { Availability } from "@/entities/Availability"
import { Doctor } from "@/entities/Doctor"
import { addDays, nextMonday, setHours, setMinutes, startOfMinute } from "date-fns"
import { anything, instance, mock, verify, when } from "ts-mockito"
import { Repository } from "typeorm"
import { DoctorService } from "./DoctorService"


describe('DoctorService', () => {
  let sut: DoctorService;
  let mockRepo: Repository<Doctor>;

  beforeEach(() => {
    mockRepo = mock(Repository);
    sut = new DoctorService(instance(mockRepo));
  });

  describe('slots query', () => {
    it('should return all slots for doctor', async () => {
      const doctor = new Doctor();
      doctor.availability = [{
        dayOfWeek: 1, // Monday
        startTimeUtc: '09:00',
        endTimeUtc: '17:00',
      }, {
        dayOfWeek: 2, // Tuesday
        startTimeUtc: '09:00',
        endTimeUtc: '12:00',
      }, {
        dayOfWeek: 2, // Tuesday
        startTimeUtc: '14:00',
        endTimeUtc: '17:00', 
      }].map((a) => {
        const availability = new Availability();
        availability.dayOfWeek = a.dayOfWeek;
        availability.startTimeUtc = a.startTimeUtc;
        availability.endTimeUtc = a.endTimeUtc;
        return availability;
      });

      when(mockRepo.find(anything())).thenResolve([doctor]);

      // from 9am next monday
      const from = setMinutes(setHours(nextMonday(new Date()), 9), 0); //fixed per right above comment
      const to = addDays(from, 7);
      const slots = await sut.getAvailableSlots(from, to);
      verify(mockRepo.find(anything())).called();
      
      const slotsOnMonday = ((17 - 9) * 60) / 15;
      const slotsOnTuesdayMorning = ((12-9)*60) / 15;
      const slotsOnTuesdayAfternoon = ((17-14)*60) / 15;
      const totalSlots = slotsOnMonday + slotsOnTuesdayAfternoon + slotsOnTuesdayMorning;

      expect(slots.length).toBe(totalSlots);
    });

    it('should not return slot if appointment exists for doctor', async () => {
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.availability = [{
        dayOfWeek: 1,
        startTimeUtc: '09:00',
        endTimeUtc: '17:00',
      }, {
        dayOfWeek: 2,
        startTimeUtc: '09:00',
        endTimeUtc: '12:00',
      }, {
        dayOfWeek: 2,
        startTimeUtc: '14:00',
        endTimeUtc: '17:00', 
      }].map((a) => {
        const availability = new Availability();
        availability.dayOfWeek = a.dayOfWeek;
        availability.startTimeUtc = a.startTimeUtc;
        availability.endTimeUtc = a.endTimeUtc;
        return availability;
      });
      
      const appointment = new Appointment();

      // set appointment start time to next monday at 2pm
      const startTime = setMinutes(setHours(nextMonday(new Date()), 14), 0); //fixed per right above comment
      appointment.startTime = startOfMinute(startTime);
      appointment.durationMinutes = 15;
      doctor.appointments = [ 
        appointment,
      ]

      when(mockRepo.find(anything())).thenResolve([doctor]);

      // from 9am next monday
      const from = setMinutes(setHours(nextMonday(new Date()), 9), 0); //fixed per right above comment
      const to = addDays(from, 7);
      const slots = await sut.getAvailableSlots(from, to);
      verify(mockRepo.find(anything())).called();
      
      const slotsOnMonday = ((17 - 9) * 60) / 15;
      const slotsOnTuesdayMorning = ((12-9)*60) / 15;
      const slotsOnTuesdayAfternoon = ((17-14)*60) / 15;
      const totalSlots = slotsOnMonday + slotsOnTuesdayAfternoon + slotsOnTuesdayMorning;

      // expect there to be 1 less slot
      expect(slots.length).toBe(totalSlots - 1);
    });
  })
})