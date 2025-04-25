import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
export function CurrencyInput({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => onValueChange(values.value)}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      customInput={Input}
      placeholder="R$ 0,00"
      className="w-full"
    />
  );
}
