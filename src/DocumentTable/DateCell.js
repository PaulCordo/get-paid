import format from "date-fns/format";
import fr from "date-fns/locale/fr";

export function DateCell({ value: date }) {
  return format(new Date(date), "P", { locale: fr });
}
