import { Doctor } from "@/entities/Doctor"
import { Slot } from "@/models/appointments/Slot"
import { NotImplementedException } from "@/models/errors/NotImplementedException"
import { addMinutes, eachDayOfInterval, format, isBefore, setHours, setMinutes, startOfMinute } from "date-fns"
import { Service } from "typedi"
import { Repository } from "typeorm"
import { InjectRepository } from "typeorm-typedi-extensions"

@Service()
export class DoctorService {

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  getDoctors() {
    return this.doctorRepo.find();
  }

  addDoctor(): Promise<Doctor> {
    throw new NotImplementedException("addDoctor: Not implemented!")
  }

  getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    return new Promise((resolve, reject) => {
      const daysBetween = eachDayOfInterval({ start: from, end: to });

      let slots:Slot[] = [];
      
      this.doctorRepo.find({
        relations: ['availability','appointments']
      })
        .then((doctors)=>{
          daysBetween.forEach((day)=>{
            doctors.forEach(doctor=>{
              for(let av of doctor.availability) {
                const endDate = startOfMinute(setMinutes(setHours( from, parseInt(av.endTimeUtc.split(':')[0])), parseInt(av.endTimeUtc.split(':')[1])));
                if(av.dayOfWeek===parseInt(format(day, "e"))) { // find match between doctor availability's dayOfWeek and day between 'from' to 'to'
                  let currentDate = startOfMinute(setMinutes(setHours( from, parseInt(av.startTimeUtc.split(':')[0])), parseInt(av.startTimeUtc.split(':')[1])));

                  for(let ap of doctor.appointments || []) {
                    if(ap.startTime.toISOString()===currentDate.toISOString()) { // compare doctor appointment and availability
                      //if found then increase current date for next slot interval
                      currentDate = addMinutes(currentDate, Slot.INTERVAL);
                    }
                  }
                  
                  while (isBefore(currentDate, endDate)) {
                    let slot = new Slot();
                    slot.doctorId = doctor.id;
                    slot.start = currentDate;
                    slot.end = addMinutes(currentDate, Slot.INTERVAL);
                    slots.push(slot);
                    currentDate = slot.end;
                  }
                }
              }
            });
          });

          resolve(slots);
        })
        .catch((reason)=>{
          reject(reason);
        });

    });
  }
}