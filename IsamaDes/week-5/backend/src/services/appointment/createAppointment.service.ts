import mongoose from "mongoose";
import { AppointmentRepository } from "../../repositories/appointementRepository";
import { UserRepository } from "../../repositories/userRepository";


export const creatAppointmentservice = async(date: Date, doctorId: string, patientId: string, notes: string) => {
  const doctor = await UserRepository.findById(doctorId);
   const patient = await UserRepository.findById(patientId);
 
   if (!doctor || doctor.role !== "doctor") {
     throw new Error("Invalid doctor ID");
   }
   if (!patient || patient.role !== "patient") {
     throw new Error("Invalid ID");
   }
 
   const appointment = await AppointmentRepository.create({
     date,
     doctor: doctorId,
     patient: patientId,
     notes,
   });
 
   if (!patient.assignedDoctor) {
     const assignedDoctor = new mongoose.Types.ObjectId(doctorId);
     await UserRepository.save(assignedDoctor);
   }
 
   return appointment;

};