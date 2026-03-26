export const CORE_COMPONENT_TYPES = [
  "Button",
  "Input",
  "Textarea",
  "Select",
  "Checkbox",
  "Radio",
  "Switch",
  "Card",
  "Modal",
  "Tabs",
  "Accordion",
  "Navbar",
] as const;

export type CoreComponentType = (typeof CORE_COMPONENT_TYPES)[number];

export const COMPONENT_TYPE_SUMMARIES: Record<CoreComponentType, string> = {
  Button: "Primary and secondary call-to-action controls.",
  Input: "Single-line text fields for forms and search.",
  Textarea: "Multi-line inputs for long-form content.",
  Select: "Dropdown field for predefined choices.",
  Checkbox: "Binary or multi-select field control.",
  Radio: "Single-choice group selector.",
  Switch: "Compact toggle for boolean settings.",
  Card: "Structured content container with hierarchy.",
  Modal: "Overlay surface for focused interactions.",
  Tabs: "Segmented content navigation inside a view.",
  Accordion: "Progressive disclosure for stacked sections.",
  Navbar: "Top-level navigation and product identity bar.",
};
