import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./button-group";
import { Button } from "./button";

const meta = {
  title: "Basic Input/ButtonGroup",
  component: ButtonGroup,
  args: { children: <><Button mode="primary">保存</Button><Button mode="tertiary">取消</Button></> },
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithDescription: Story = { args: { description: "保存后将更新当前草稿。" } };
export const Rtl: Story = { args: { dir: "rtl", description: "Actions follow the container direction." } };
