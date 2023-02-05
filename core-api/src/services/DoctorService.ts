import { Doctor } from "@/entities/Doctor"
import { Slot } from "@/models/appointments/Slot"
import { NotImplementedException } from "@/models/errors/NotImplementedException"
import { addMinutes, eachDayOfInterval, format, isBefore, isEqual, setHours, setMinutes, startOfMinute } from "date-fns"
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
                if(av.dayOfWeek===(parseInt(format(day, "e"))-1)) { // find match between doctor availability's dayOfWeek and day between 'from' to 'to'
                  const endOfDayAvailability = startOfMinute(setMinutes(setHours( day, parseInt(av.endTimeUtc.split(':')[0])), parseInt(av.endTimeUtc.split(':')[1])));
                  let startOfDayAvailability = startOfMinute(setMinutes(setHours( day, parseInt(av.startTimeUtc.split(':')[0])), parseInt(av.startTimeUtc.split(':')[1])));
                  
                  let canAddSlot;
                  while (isBefore(startOfDayAvailability, endOfDayAvailability) && isBefore(startOfDayAvailability,daysBetween[daysBetween.length-1])) {
                    canAddSlot = true;
                    for(let ap of doctor.appointments || []) {
                      if(isEqual(ap.startTime, startOfDayAvailability)) { // compare doctor appointment and availability
                        //if the same then can't add slot and break appointments loop
                        canAddSlot = false;
                        break;
                      }
                    }

                    if(canAddSlot) {
                      let slot = new Slot();
                      slot.doctorId = doctor.id;
                      slot.start = startOfDayAvailability;
                      slot.end = addMinutes(startOfDayAvailability, Slot.INTERVAL);
                      slots.push(slot);
                    }
                    
                    startOfDayAvailability = addMinutes(startOfDayAvailability, Slot.INTERVAL);
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