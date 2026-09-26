import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MultiSelect } from "./multi-select";

const options = [
  { value: "design", label: "设计" },
  { value: "engineering", label: "开发" },
  { value: "research", label: "研究" },
  { value: "locked", label: "只读选项", disabled: true },
];
const meta = {
  title: "Information Collect/MultiSelect",
  component: MultiSelect,
  args: { options, placeholder: "选择团队", "aria-label": "团队" },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof MultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { defaultValue: ["design"] } };
export const Disabled: Story = { args: { disabled: true, defaultValue: ["design", "engineering"] } };
export const BigRounded: Story = { args: { size: "big", allRound: true, defaultValue: ["design", "research"] } };
export const Controlled: Story = {
  render: args => {
    const [value, setValue] = useState(["design"]);
    return <><MultiSelect {...args} value={value} onValueChange={setValue} name="teams" /><output>{value.join(", ")}</output></>;
  },
};
