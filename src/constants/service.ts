export const SERVICE_DURATIONS = [15, 30, 60] as const;
export type TServiceDuration = (typeof SERVICE_DURATIONS)[number];
