import { useTerminalDimensions } from "@opentui/solid"
import type { Plugin } from "@opencode-ai/plugin/tui"
import { createSignal } from "solid-js"
import { PromptInterruptStatus } from "../../../component/prompt"
import { StoryFooter } from "./footer"
import type { Story } from "./index"

function InterruptHintStory(props: { context: Plugin.Context }) {
  const dimensions = useTerminalDimensions()
  const theme = () => props.context.theme
  const [armed, setArmed] = createSignal(false)
  const [animations, setAnimations] = createSignal(true)

  props.context.keymap.layer(() => ({
    commands: [
      {
        bind: "escape",
        title: "Back to storybook",
        group: "Storybook",
        run: () => props.context.ui.router.navigate({ type: "plugin", name: "storybook" }),
      },
      {
        bind: "space",
        title: "Simulate escape",
        group: "Storybook",
        run: () => setArmed((current) => !current),
      },
      {
        bind: "a",
        title: "Toggle animations",
        group: "Storybook",
        run: () => setAnimations((current) => !current),
      },
      {
        bind: "t",
        title: "Switch theme",
        group: "Storybook",
        run: () => props.context.keymap.dispatch("theme.switch"),
      },
    ],
  }))

  return (
    <box
      width={dimensions().width}
      height={dimensions().height}
      flexDirection="column"
      backgroundColor={theme().background.default}
    >
      <box paddingLeft={2} paddingTop={1} paddingBottom={1} flexDirection="column">
        <text fg={theme().text.default}>interrupt confirmation</text>
        <text fg={theme().text.subdued}>the selected quick ignition follows each theme's semantic warning scale</text>
      </box>
      <box height={3} flexDirection="row" paddingLeft={2} paddingRight={2} alignItems="center">
        <box width={22} flexDirection="column">
          <text fg={theme().text.default}>Quick ignition</text>
          <text fg={theme().text.subdued}>warning lift, 220 ms</text>
        </box>
        <box marginLeft={2}>
          <PromptInterruptStatus
            armed={armed()}
            animations={animations()}
            text={theme().text.default}
            subdued={theme().text.subdued}
            warning={theme().text.feedback.warning.default}
            flash={theme().decrease(theme().text.feedback.warning.default, 2)}
          />
        </box>
      </box>
      <box flexGrow={1} />
      <StoryFooter
        context={props.context}
        title="storybook / interrupt confirmation"
        status={armed() ? "armed" : "running"}
        message={animations() ? "animations on" : "animations off"}
        controls={[
          { shortcut: "space", label: "simulate esc" },
          { shortcut: "t", label: "theme" },
          { shortcut: "a", label: "animation" },
          { shortcut: "esc", label: "back" },
        ]}
      />
    </box>
  )
}

export const interruptHintStory: Story = {
  id: "interrupt-hint",
  title: "Interrupt confirmation",
  render: (context) => <InterruptHintStory context={context} />,
}
