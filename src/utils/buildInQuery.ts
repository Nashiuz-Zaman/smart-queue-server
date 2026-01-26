export const buildInQuery = (value: string | string[] | undefined) => {
  if (!value) return {};

  const arr = Array.isArray(value) ? value : value.split(",");

  const cleaned = arr.map((v) => v.trim()).filter(Boolean);

  return cleaned.length > 0 ? { $in: cleaned } : {};
};
