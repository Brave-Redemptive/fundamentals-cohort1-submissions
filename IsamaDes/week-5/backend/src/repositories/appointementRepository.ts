import Appointment from "../models/Appointment";

export const AppointmentRepository = {
  async create(data: {
    date: Date;
    doctor: string;
    patient: string;
    notes?: string;
  }) {
    const appointment = new Appointment(data);
    return await appointment.save();
  },

  async findById(id: string) {
    return await Appointment.findById(id)
      .populate("doctor", "name email")
      .populate("patient", "name email");
  },

  async findByDoctorId(doctorId: string) {
    return await Appointment.find({ doctor: doctorId })
      .populate("patient", "name email")
      .sort({ date: -1 });
  },

  async findByPatientId(patientId: string) {
    return await Appointment.find({ patient: patientId })
      .populate("doctor", "name email")
      .sort({ date: -1 });
  },
  async save(appointment: any){
    const saved = await appointment.save();
    return await saved.populate({ path: "patient", select: "name email" },
  { path: "doctor", select: "name email" })
  }
};
