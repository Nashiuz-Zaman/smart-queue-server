import { AppointmentModel } from "./appointment.model";
import { StaffModel } from "../staff/staff.model";
import { ServiceModel } from "../services/service.model";
import { IAppointment, IAppointmentFilter } from "./appointment.type";
import { throwBadRequest, throwConflict, throwNotFound } from "../../utils";

export const hasTimeConflict = async ({
  staffId,
  newStart,
  newEnd,
  excludeAppointmentId,
}: {
  staffId: string;
  newStart: Date;
  newEnd: Date;
  excludeAppointmentId?: string;
}) => {
  const dayStart = new Date(newStart);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(newStart);
  dayEnd.setHours(23, 59, 59, 999);

  const appointments = await AppointmentModel.find({
    assignedStaff: staffId,
    status: "Scheduled",
    dateTime: { $gte: dayStart, $lte: dayEnd },
    ...(excludeAppointmentId && { _id: { $ne: excludeAppointmentId } }),
  }).sort({ dateTime: 1 });

  for (const appt of appointments) {
    const existingStart = appt.dateTime;
    const existingEnd = appt.endTime;

    // overlap condition
    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }

  return false;
};

// ----------------------------- Service -----------------------------
export const AppointmentService = {
  getAppointments: async (filters?: IAppointmentFilter) => {
    const query: any = {};
    if (filters?.serviceName) query.serviceName = filters.serviceName;
    if (filters?.assignedStaff) query.assignedStaff = filters.assignedStaff;
    if (filters?.dateTime) {
      const start = new Date(filters.dateTime);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filters.dateTime);
      end.setHours(23, 59, 59, 999);
      query.dateTime = { $gte: start, $lte: end };
    }

    return AppointmentModel.find(query)
      .populate("assignedStaff")
      .sort({ dateTime: 1 });
  },

  getUniqueServices: async () => {
    return ServiceModel.find({ isActive: true }).select(
      "name requiredStaffType",
    );
  },

  getStaffByType: async (staffType?: string) => {
    const staffQuery: any = { isActive: true };

    // Only filter by serviceType if NOT "ALL"
    if (staffType && staffType !== "all") {
      staffQuery.serviceType = staffType;
    }

    const staffList = await StaffModel.find(staffQuery);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return Promise.all(
      staffList.map(async (staff) => {
        const appointmentsToday = await AppointmentModel.countDocuments({
          assignedStaff: staff._id,
          dateTime: { $gte: todayStart, $lte: todayEnd },
          status: "Scheduled",
        });

        return {
          _id: staff._id,
          name: staff.name,
          dailyCapacity: staff.dailyCapacity,
          appointmentsToday,
          availabilityStatus: staff.availabilityStatus,
          serviceType: staff.serviceType,
        };
      }),
    );
  },

  createAppointment: async (data: IAppointment) => {
    const service = await ServiceModel.findOne({ name: data.serviceName });
    if (!service) return throwBadRequest("Selected service does not exist");

    let assignedStaffId = data.assignedStaff;

    const newStart = new Date(data.dateTime);
    const newEnd = new Date(newStart.getTime() + service.duration * 60 * 1000);

    if (assignedStaffId) {
      const staff = await StaffModel.findById(assignedStaffId);
      if (!staff) return throwNotFound("Assigned staff not found");

      if (staff.serviceType !== service.requiredStaffType)
        return throwBadRequest("Assigned staff does not match service type");

      // -------- Time Conflict Check --------
      const conflict = await hasTimeConflict({
        staffId: staff._id.toString(),
        newStart,
        newEnd,
      });

      if (conflict)
        return throwConflict(
          "This staff member already has an appointment at this time",
        );

      // -------- Daily Capacity Check --------
      const dayStart = new Date(newStart);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(newStart);
      dayEnd.setHours(23, 59, 59, 999);

      const appointmentsToday = await AppointmentModel.countDocuments({
        assignedStaff: staff._id,
        status: "Scheduled",
        dateTime: { $gte: dayStart, $lte: dayEnd },
      });

      if (appointmentsToday >= staff.dailyCapacity)
        return throwConflict("This staff member has reached daily capacity");
    }

    // Save → if no staff selected, goes to waiting queue naturally
    return AppointmentModel.create({
      ...data,
      endTime: newEnd,
      assignedStaff: assignedStaffId,
    });
  },

  updateAppointment: async (id: string, data: Partial<IAppointment>) => {
    const existing = await AppointmentModel.findById(id);
    if (!existing) return throwNotFound("Appointment not found");

    if (!data.assignedStaff || !data.dateTime) {
      return AppointmentModel.findByIdAndUpdate(id, data, { new: true });
    }

    const service = await ServiceModel.findOne({
      name: data.serviceName ?? existing.serviceName,
    });
    if (!service) return throwBadRequest("Selected service does not exist");

    const newStart = new Date(data.dateTime);
    const newEnd = new Date(newStart.getTime() + service.duration * 60 * 1000);

    const conflict = await hasTimeConflict({
      staffId: data.assignedStaff.toString(),
      newStart,
      newEnd,
      excludeAppointmentId: id,
    });

    if (conflict)
      return throwConflict(
        "This staff member already has an appointment at this time",
      );

    return AppointmentModel.findByIdAndUpdate(
      id,
      { ...data, endTime: newEnd },
      { new: true },
    );
  },
};
