import { cn } from "../../lib/utils";
import { useLocaleMessages } from "../../locale";
import { DatePickerTimeWheelColumn } from "../date-picker/date-picker-time-wheel";
import type { TimePickerValue } from "./time-picker-context";

export const TIME_PICKER_HOUR_VALUES = Array.from(
  { length: 24 },
  (_, index) => index
);
export const TIME_PICKER_MINUTE_VALUES = Array.from(
  { length: 12 },
  (_, index) => index * 5
);

export const TIME_PICKER_SECOND_VALUES = Array.from({ length: 60 }, (_, index) => index);

export type TimePickerWheelsValue = TimePickerValue;

type TimePickerWheelsProps = {
  value: TimePickerWheelsValue;
  onChange: (value: TimePickerWheelsValue) => void;
  className?: string;
  showSeconds?: boolean;
};

export function TimePickerWheels({
  value,
  onChange,
  className,
  showSeconds = false,
}: TimePickerWheelsProps) {
  const locale = useLocaleMessages("TimePicker");

  return (
    <div
      className={cn("aviala-datepicker-time", className)}
      role="group"
      aria-label={locale.selectTime}
    >
      <div className="aviala-datepicker-time__columns" data-seconds={showSeconds ? "true" : undefined}>
        <DatePickerTimeWheelColumn
          className="aviala-datepicker-time__hour"
          aria-label={locale.hour}
          values={TIME_PICKER_HOUR_VALUES}
          value={value.hours}
          onChange={(hours) => onChange({ ...value, hours })}
        />
        <DatePickerTimeWheelColumn
          className="aviala-datepicker-time__minute"
          aria-label={locale.minute}
          values={TIME_PICKER_MINUTE_VALUES}
          value={value.minutes}
          onChange={(minutes) => onChange({ ...value, minutes })}
        />
        {showSeconds && <DatePickerTimeWheelColumn
          className="aviala-datepicker-time__second"
          aria-label={locale.second ?? "Second"}
          values={TIME_PICKER_SECOND_VALUES}
          value={value.seconds ?? 0}
          onChange={(seconds) => onChange({ ...value, seconds })}
        />}
      </div>
    </div>
  );
}
