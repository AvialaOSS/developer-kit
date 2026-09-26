import type { Meta, StoryObj } from "@storybook/react";
import { useState, type CSSProperties } from "react";
import { Button } from "./button";
import { ScrollPicker, ScrollPickerColumn } from "./scroll-picker";

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

const meta: Meta<typeof ScrollPicker> = {
  title: "Information Collect/ScrollPicker",
  component: ScrollPicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollPicker>;

export const TokenGeometry: Story = {
  render: () => {
    const [value, setValue] = useState("09");
    const [expanded, setExpanded] = useState(false);
    const [legacyHeight, setLegacyHeight] = useState(false);
    return (
      <div>
        <Button onClick={() => setExpanded(!expanded)}>切换内边距：{expanded ? "8px" : "4px"}</Button>
        <Button onClick={() => setLegacyHeight(!legacyHeight)}>旧高度覆盖：{legacyHeight ? "40px" : "关闭"}</Button>
        <p>当前值：{value}；切换尺寸后应保持居中，高亮与选项等高。</p>
        <ScrollPicker style={{
          "--scroll-picker-item-size-padding-y": expanded ? "8px" : "4px",
          "--scroll-picker-item-height": legacyHeight ? "40px" : undefined,
        } as CSSProperties}>
          <ScrollPickerColumn aria-label="Loop hour" values={hours} value={value} onChange={setValue} />
          <ScrollPickerColumn aria-label="Finite hour" values={hours} value={value} onChange={setValue} loop={false} />
        </ScrollPicker>
      </div>
    );
  },
};

export const DualColumn: Story = {
  render: () => {
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("30");
    return (
      <ScrollPicker>
        <ScrollPickerColumn
          aria-label="Hour"
          values={hours}
          value={hour}
          onChange={setHour}
        />
        <ScrollPickerColumn
          aria-label="Minute"
          values={minutes}
          value={minute}
          onChange={setMinute}
        />
      </ScrollPicker>
    );
  },
};

export const SingleColumn: Story = {
  render: () => {
    const [value, setValue] = useState("Apple");
    return (
      <ScrollPicker style={{ width: 160 }}>
        <ScrollPickerColumn
          aria-label="Fruit"
          values={[
            "Apple",
            "Banana",
            "Cherry",
            "Date",
            "Elderberry",
            "Fig",
            "Grape",
          ]}
          value={value}
          onChange={setValue}
          loop={false}
        />
      </ScrollPicker>
    );
  },
};
