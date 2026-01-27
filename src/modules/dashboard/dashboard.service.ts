import { AppointmentModel } from "../appointments/appointment.model";
import { StaffModel } from "../staff/staff.model";
import { APPOINTMENT_STATUSES } from "../../constants/appointment";

export const DashboardService = {
  getDashboardData: async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // ----------------------------- Appointments -----------------------------
    const totalAppointmentsToday = await AppointmentModel.countDocuments({
      dateTime: { $gte: todayStart, $lte: todayEnd },
    });

    const completedAppointments = await AppointmentModel.countDocuments({
      dateTime: { $gte: todayStart, $lte: todayEnd },
      status: "Completed",
    });

    const pendingAppointments = await AppointmentModel.countDocuments({
      dateTime: { $gte: todayStart, $lte: todayEnd },
      status: "Scheduled",
    });

    const waitingQueueCount = await AppointmentModel.countDocuments({
      assignedStaff: null,
      status: "Scheduled",
    });

    // ----------------------------- Staff Load -----------------------------
    const staffList = await StaffModel.find({ isActive: true });

    const staffLoadSummary = await Promise.all(
      staffList.map(async (staff) => {
        const appointmentsToday = await AppointmentModel.countDocuments({
          assignedStaff: staff._id,
          dateTime: { $gte: todayStart, $lte: todayEnd },
          status: "Scheduled",
        });

        return {
          _id: staff._id,
          name: staff.name,
          assignedToday: appointmentsToday,
          dailyCapacity: staff.dailyCapacity,
          status:
            appointmentsToday >= staff.dailyCapacity ? "Booked" : "OK",
        };
      }),
    );

    return {
      totalAppointmentsToday,
      completedAppointments,
      pendingAppointments,
      waitingQueueCount,
      staffLoadSummary,
    };
  },
};
