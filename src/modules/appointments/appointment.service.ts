import { AppointmentModel } from "./appointment.model";
import { StaffModel } from "../staff/staff.model";
import { ServiceModel } from "../services/service.model";
import { IAppointment, IAppointmentFilter } from "./appointment.type";
import { throwBadRequest, throwConflict, throwNotFound } from "../../utils";
import { ActivityService } from "../activity/activity.service";

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

    let newEndTime = existing.endTime;

    // If dateTime or service changed, recalc endTime
    if (data.dateTime || data.serviceName) {
      const service = await ServiceModel.findOne({
        name: data.serviceName ?? existing.serviceName,
      });
      if (!service) return throwBadRequest("Selected service does not exist");

      const newStart = new Date(data.dateTime ?? existing.dateTime);
      newEndTime = new Date(newStart.getTime() + service.duration * 60 * 1000);

      // Only check conflict if assignedStaff is provided
      const staffId = data.assignedStaff ?? existing.assignedStaff;
      if (staffId) {
        const conflict = await hasTimeConflict({
          staffId: staffId.toString(),
          newStart,
          newEnd: newEndTime,
          excludeAppointmentId: id,
        });

        if (conflict)
          return throwConflict(
            "This staff member already has an appointment at this time",
          );
      }

      // Ensure endTime is included in the update
      data.endTime = newEndTime;
    }

    return AppointmentModel.findByIdAndUpdate(id, data, { new: true });
  },

  getWaitingQueue: async () => {
    return await AppointmentModel.find({
      assignedStaff: null,
      status: "Scheduled",
    }).sort({ dateTime: 1 }); // earliest first
  },

  assignFromQueue: async (staffId: string) => {
    const staff = await StaffModel.findById(staffId);
    if (!staff) return throwNotFound("Staff not found");

    if (staff.availabilityStatus !== "Available")
      return throwBadRequest("Staff is currently not available");

    // 1 Get all waiting appointments
    const waitingAppointments = await AppointmentModel.find({
      assignedStaff: null,
      status: "Scheduled",
    }).sort({ dateTime: 1 }); // earliest first

    for (const appt of waitingAppointments) {
      // 2   if staff type matches service requirement
      const service = await ServiceModel.findOne({ name: appt.serviceName });
      if (!service) continue; // skip if service not found

      if (staff.serviceType !== service.requiredStaffType) continue;

      // 3 Check daily capacity
      const dayStart = new Date(appt.dateTime);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(appt.dateTime);
      dayEnd.setHours(23, 59, 59, 999);

      const appointmentsToday = await AppointmentModel.countDocuments({
        assignedStaff: staff._id,
        dateTime: { $gte: dayStart, $lte: dayEnd },
        status: "Scheduled",
      });

      if (appointmentsToday >= staff.dailyCapacity) continue;

      // 4 Check time conflict
      const newEnd = new Date(
        appt.dateTime.getTime() + service.duration * 60 * 1000,
      );
      const conflict = await hasTimeConflict({
        staffId: staff._id.toString(),
        newStart: appt.dateTime,
        newEnd,
      });

      if (conflict) continue;

      appt.assignedStaff = staff._id;
      await appt.save();

      await ActivityService.log({
        type: "QUEUE_ASSIGN",
        message: `Appointment for "${appt.customerName}" auto-assigned to ${staff.name}`,
        appointmentId: appt._id.toString(),
        staffId: staff._id.toString(),
        customerName: appt.customerName,
      });

      return appt; // return the assigned appointment
    }

    return null; // no eligible appointment
  },
};
