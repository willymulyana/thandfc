import { Appointment } from "@/entities/Appointment"
import { Doctor } from "@/entities/Doctor"
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput"
import { isEqual, startOfMinute } from "date-fns"
import { Service } from "typedi"
import { Repository } from "typeorm"
import { InjectRepository } from "typeorm-typedi-extensions"

@Service()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    return new Promise(async (resolve, reject) => {
      this.doctorRepo.findOne(options.slot.doctorId, {
        relations: ['appointments']
      })
        .then((doctor)=>{
          let doctorIsAvailable = true;
          for(let ap of doctor?.appointments || []) {
            const appointmentDate = startOfMinute(ap.startTime);
            const slotDate = startOfMinute(options.slot.start);
            if(isEqual(appointmentDate, slotDate)) {
              doctorIsAvailable = false;
              break;
            }
          }
          
          if(doctorIsAvailable) {
            const newAppointment = new Appointment();
            newAppointment.doctor = doctor;
            newAppointment.startTime = options.slot.start;
      
            resolve(this.appointmentRepo.save(newAppointment));
          } else {
            reject(new Error("Appointment slot already taken"));
          }
        })
        .catch((reason)=>{
          console.log('reason', reason);
          reject(reason);
        });
    });
  }
}