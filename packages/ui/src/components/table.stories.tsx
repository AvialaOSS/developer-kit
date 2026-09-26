import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import { GeneralSetting, SymbolMore } from "@aviala-design/icons";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { Table, TableCell, TableHead, TableRow } from "./table";

const meta: Meta<typeof Table> = {
  title: "Information Display/Table",
  component: Table,
  tags: ["autodocs"],
};
export default meta;

function MoreActions() {
  return (
    <>
      <Button
        mode="noBackgroundCustom"
        size="small"
        iconOnly
        aria-label="Settings"
      >
        <GeneralSetting aria-hidden />
      </Button>
      <Button mode="noBackgroundCustom" size="small" iconOnly aria-label="More">
        <SymbolMore thickness="Light" aria-hidden />
      </Button>
    </>
  );
}

const ROWS = [
  {
    id: "1",
    name: "Kai Lark",
    caption: "Owner",
    badge: "Active",
    switchOn: true,
  },
  {
    id: "2",
    name: "Ada Chen",
    caption: "Editor",
    badge: "Away",
    switchOn: false,
  },
  {
    id: "3",
    name: "Bo Park",
    caption: "Viewer",
    badge: "Active",
    switchOn: true,
  },
] as const;

function SelectableTable({ stickyHeader = false }: { stickyHeader?: boolean }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    "1": false,
    "2": true,
    "3": false,
  });

  const ids = useMemo(() => ROWS.map((row) => row.id), []);
  const selectedCount = ids.filter((id) => selected[id]).length;
  const allChecked = selectedCount === ids.length;
  const someChecked = selectedCount > 0 && !allChecked;

  return (
    <Table
      stickyHeader={stickyHeader}
      style={{ width: 720, maxHeight: stickyHeader ? 280 : undefined }}
    >
      <TableRow header>
        <TableHead
          content="checkbox"
          checkboxProps={{
            checked: allChecked ? true : someChecked ? "indeterminate" : false,
            onCheckedChange: (value) => {
              const next = value === true;
              setSelected(Object.fromEntries(ids.map((id) => [id, next])));
            },
            "aria-label": "Select all rows",
          }}
        />
        <TableHead actions={<MoreActions />}>Name</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Notify</TableHead>
      </TableRow>
      {ROWS.map((row) => (
        <TableRow key={row.id}>
          <TableCell
            content="checkbox"
            checkboxProps={{
              checked: Boolean(selected[row.id]),
              onCheckedChange: (value) =>
                setSelected((prev) => ({ ...prev, [row.id]: value === true })),
              "aria-label": `Select ${row.name}`,
            }}
          />
          <TableCell
            content="people"
            people={
              <Avatar content="text" level="text" lineHeightFix={false}>
                {row.name.charAt(0)}
              </Avatar>
            }
            text={row.name}
            caption={row.caption}
            actions={<MoreActions />}
          />
          <TableCell
            content="badge"
            badgeLabel={row.badge}
            actions={<MoreActions />}
          />
          <TableCell
            content="switch"
            switchProps={{ defaultChecked: row.switchOn }}
          />
        </TableRow>
      ))}
    </Table>
  );
}

export const Default: StoryObj<typeof Table> = {
  render: () => <SelectableTable />,
};

export const StickyHeader: StoryObj<typeof Table> = {
  render: () => <SelectableTable stickyHeader />,
};

/** Matches the mixed column sizing in Figma Table 1457:1475. */
export const MixedColumnWidths: StoryObj<typeof Table> = {
  render: () => {
    const fixedColumn = { flex: "0 0 126px" };
    return (
      <Table
        aria-label="Mixed column widths"
        style={{ width: 855, maxWidth: "100%" }}
      >
        <TableRow header>
          <TableHead
            content="checkbox"
            checkboxProps={{ "aria-label": "Select all" }}
          />
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead style={fixedColumn}>Actions</TableHead>
        </TableRow>
        {ROWS.map((row) => (
          <TableRow key={row.id}>
            <TableCell
              content="checkbox"
              checkboxProps={{ "aria-label": `Select ${row.name}` }}
            />
            <TableCell text={row.name} />
            <TableCell text={row.caption} />
            <TableCell text={row.badge} />
            <TableCell
              content="action"
              style={fixedColumn}
              actions={<MoreActions />}
            />
          </TableRow>
        ))}
      </Table>
    );
  },
};

export const ContentVariants: StoryObj<typeof Table> = {
  render: () => (
    <Table aria-label="Table content variants" style={{ width: 640 }}>
      <TableRow header>
        <TableHead>Content</TableHead>
        <TableHead
          leftIcon={<GeneralSetting aria-hidden />}
          rightIcon={<SymbolMore aria-hidden />}
          actions={<MoreActions />}
        >
          Example
        </TableHead>
      </TableRow>
      <TableRow>
        <TableCell text="Text" />
        <TableCell
          text="Title"
          caption="Description"
          actions={<MoreActions />}
        />
      </TableRow>
      <TableRow>
        <TableCell text="Icon" />
        <TableCell
          content="icon+text"
          icon={<GeneralSetting aria-hidden />}
          text="Settings"
          caption="Description"
          actions={<MoreActions />}
        />
      </TableRow>
      <TableRow>
        <TableCell text="Icon place" />
        <TableCell
          content="icon-place+text"
          icon={<GeneralSetting aria-hidden />}
          text="Settings"
          caption="Description"
        />
      </TableRow>
      <TableRow>
        <TableCell text="Default avatar" />
        <TableCell content="people" text="Member" caption="Designer" />
      </TableRow>
      <TableRow>
        <TableCell text="Badge" />
        <TableCell
          content="badge"
          badgeLabel="Active"
          actions={<MoreActions />}
        />
      </TableRow>
      <TableRow>
        <TableCell text="Switch" />
        <TableCell
          content="switch"
          switchProps={{ "aria-label": "Enable notifications" }}
        />
      </TableRow>
      <TableRow>
        <TableCell text="Actions" />
        <TableCell content="action" actions={<MoreActions />} />
      </TableRow>
      <TableRow>
        <TableCell text="Custom children" />
        <TableCell>
          <Button mode="tertiary" size="small">
            Custom action
          </Button>
        </TableCell>
      </TableRow>
    </Table>
  ),
};
