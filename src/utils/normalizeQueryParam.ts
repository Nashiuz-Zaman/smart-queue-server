export const normalizeNumberField = <T extends Record<string, any>>(
  queryObj: T,
  field: keyof T
): T => {
  const copy = { ...queryObj };
  const val = Number(copy[field]);

  if (Number.isFinite(val)) {
    copy[field] = val as T[typeof field];
  }
  return copy;
};

export const normalizeStatusFilter = <
  T extends { status?: any; [key: string]: any }
>(
  queryObj: T,
  fallback?: Record<string, any>
): T => {
  const newQueryObj = { ...queryObj };

  if (newQueryObj.status === "all" || newQueryObj.status === undefined) {
    if (fallback) {
      newQueryObj.status = fallback;
    } else {
      delete newQueryObj.status;
    }
  } else {
    return normalizeNumberField(newQueryObj, "status");
  }

  return newQueryObj;
};
