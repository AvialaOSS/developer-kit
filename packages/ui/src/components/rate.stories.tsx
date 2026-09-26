import type { Meta, StoryObj } from "@storybook/react";
import { Rate, RateIcon } from "./rate";

const meta = { title: "Information Collect/Rate", component: Rate, args: { defaultValue: 2.5, allowHalf: true } } satisfies Meta<typeof Rate>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Like: Story = { args: { type: "like" } };
export const Disabled: Story = { args: { disabled: true } };
export const Sizes: Story = { render: () => <div style={{ display: "grid", gap: 16 }}>{(["small", "default", "big"] as const).map(size => <Rate key={size} size={size} defaultValue={2.5} allowHalf aria-label={`${size} rating`} />)}</div> };
export const IconStates: Story = { render: () => <div style={{ display: "grid", gap: 16 }}>{(["star", "like"] as const).map(type => <div key={type} style={{ display: "flex", gap: 12 }}>{(["empty", "half", "fill"] as const).map(status => <RateIcon key={status} type={type} status={status} />)}</div>)}</div> };
