import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { FormField } from "../form-field";
import { Button } from "../button";
import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerField,
  DatePickerTrigger,
  type DatePickerSize,
  type DateRange,
} from "./date-picker";
import { useDatePickerContext } from "./date-picker-context";
const meta: Meta<typeof DatePickerField> = {
  title: "Information Collect/DatePicker",
  component: DatePickerField,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "big"] satisfies DatePickerSize[],
    },
    mode: {
      control: "select",
      options: ["single", "range"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePickerField>;

function SingleDemo({
  size = "regular",
  allRound = false,
  disabled = false,
  error = false,
  defaultOpen = false,
  defaultValue,
}: {
  size?: DatePickerSize;
  allRound?: boolean;
  disabled?: boolean;
  error?: boolean;
  defaultOpen?: boolean;
  defaultValue?: Date;
}) {
  const [value, setValue] = useState<Date | undefined>(defaultValue);

  return (
    <DatePickerField
      mode="single"
      size={size}
      allRound={allRound}
      disabled={disabled}
      error={error}
      defaultOpen={defaultOpen}
      value={value}
      onValueChange={setValue}
      className="w-[290px]"
    />
  );
}

function RangeDemo({
  size = "regular",
  allRound = false,
  disabled = false,
  error = false,
  defaultOpen = false,
  defaultValue,
}: {
  size?: DatePickerSize;
  allRound?: boolean;
  disabled?: boolean;
  error?: boolean;
  defaultOpen?: boolean;
  defaultValue?: DateRange;
}) {
  const [value, setValue] = useState<DateRange>(defaultValue ?? {});

  return (
    <DatePickerField
      mode="range"
      size={size}
      allRound={allRound}
      disabled={disabled}
      error={error}
      defaultOpen={defaultOpen}
      value={value}
      onValueChange={setValue}
      className="w-[320px]"
    />
  );
}

export const SingleEmpty: Story = {
  render: () => <SingleDemo />,
};

export const SingleFilled: Story = {
  render: () => <SingleDemo defaultValue={new Date(2026, 6, 4)} />,
};

export const SingleOpen: Story = {
  render: () => <SingleDemo defaultOpen />,
};

export const RangeEmpty: Story = {
  render: () => <RangeDemo />,
};

export const RangeFilled: Story = {
  render: () => (
    <RangeDemo
      defaultValue={{
        from: new Date(2026, 6, 1),
        to: new Date(2026, 6, 15),
      }}
    />
  ),
};

export const RangeOpen: Story = {
  render: () => <RangeDemo defaultOpen />,
};

export const Big: Story = {
  render: () => <SingleDemo size="big" defaultValue={new Date(2026, 6, 4)} />,
};

export const AllRound: Story = {
  render: () => <SingleDemo allRound defaultValue={new Date(2026, 6, 4)} />,
};

export const Disabled: Story = {
  render: () => <SingleDemo disabled defaultValue={new Date(2026, 6, 4)} />,
};

export const Error: Story = {
  render: () => <SingleDemo error />,
};

export const WithFormField: Story = {
  render: () => (
    <FormField
      label="Event date"
      htmlFor="event-date"
      description="Pick a date for your event."
      className="w-[290px]"
    >
      <DatePickerField mode="single" placeholder="Select date" />
    </FormField>
  ),
};

export const CompoundComposition: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();

    return (
      <DatePicker
        mode="single"
        value={value}
        onValueChange={setValue}
        className="w-[290px]"
      >
        <DatePickerTrigger placeholder="Custom composition" />
        <DatePickerContent />
      </DatePicker>
    );
  },
};

export const WithTime: Story = {
  render: () => <SingleDemo defaultValue={new Date(2026, 5, 10)} defaultOpen />,
};

export const WithTimeOpenOnTimePanel: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>(
      new Date(2026, 5, 10, 14, 30)
    );
    const [changes, setChanges] = useState(0);

    return (
      <div className="flex flex-col items-start gap-4">
        <Button onClick={() => setValue(new Date(2026, 5, 10, 9, 45))}>
          Set controlled date to 09:45
        </Button>
        <output aria-label="Date change count">{changes}</output>
        <DatePicker
          mode="single"
          defaultOpen
          value={value}
          onValueChange={(next) => {
            setValue(next);
            setChanges((count) => count + 1);
          }}
          className="w-[290px]"
        >
          <DatePickerTrigger />
          <DatePickerContent>
            <TimePanelOpenCalendar />
          </DatePickerContent>
        </DatePicker>
      </div>
    );
  },
};

export const TimeSourcePrecedence: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <DatePickerField
        label="Date supplies time"
        defaultValue={new Date(2026, 5, 10, 14, 30)}
      />
      <DatePickerField
        label="Explicit default time"
        defaultValue={new Date(2026, 5, 10, 14, 30)}
        defaultTimeValue={{ hours: 10, minutes: 15 }}
      />
      <DatePickerField
        label="Controlled time wins"
        value={new Date(2026, 5, 10, 14, 30)}
        timeValue={{ hours: 11, minutes: 20 }}
        defaultTimeValue={{ hours: 10, minutes: 15 }}
      />
      <DatePickerField
        label="Range anchor supplies time"
        mode="range"
        defaultValue={{
          from: new Date(2026, 5, 10, 8, 25),
          to: new Date(2026, 5, 12, 8, 25),
        }}
      />
    </div>
  ),
};

function TimePanelOpenCalendar() {
  const { setActivePanel } = useDatePickerContext();
  useEffect(() => {
    setActivePanel("time");
  }, [setActivePanel]);

  return <DatePickerCalendar />;
}

export const WithTimeRange: Story = {
  render: () => (
    <RangeDemo
      defaultOpen
      defaultValue={{
        from: new Date(2026, 4, 23),
        to: new Date(2026, 4, 28),
      }}
    />
  ),
};

export const DateOnly: Story = {
  render: () => (
    <DatePickerField
      mode="single"
      enableTime={false}
      defaultValue={new Date(2026, 6, 4)}
      className="w-[290px]"
    />
  ),
};

export const MonthYearWheels: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>(new Date(2026, 6, 4));

    return (
      <DatePicker
        mode="single"
        defaultOpen
        enableTime={false}
        value={value}
        onValueChange={setValue}
        className="w-[290px]"
      >
        <DatePickerTrigger />
        <DatePickerContent>
          <MonthPanelOpenCalendar />
        </DatePickerContent>
      </DatePicker>
    );
  },
};

export const TypedInput: Story = {
  name: "Typed input",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Type <code>2026-07-04</code> or <code>2026/07/04 14:30</code>, then
        press Enter.
      </p>
      <SingleDemo defaultValue={new Date(2026, 6, 4)} />
    </div>
  ),
};

function MonthPanelOpenCalendar() {
  const { setActivePanel } = useDatePickerContext();
  useEffect(() => {
    setActivePanel("month");
  }, [setActivePanel]);

  return <DatePickerCalendar />;
}

const sizes: DatePickerSize[] = ["regular", "big"];

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {size}
          </span>
          <DatePickerField
            mode="single"
            size={size}
            defaultValue={new Date(2026, 6, 4)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  ),
};
