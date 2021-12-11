import compareAsc from "date-fns/compareAsc";

export function dateOrderer(
  { original: { date: dateA } },
  { original: { date: dateB } }
) {
  return compareAsc(new Date(dateA), new Date(dateB));
}
