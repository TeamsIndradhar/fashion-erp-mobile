import { Text, type TextProps } from "react-native";
import { colors, typography } from "../theme/tokens";

type Variant = keyof typeof typography;

export function AppText({ variant = "body", color = colors.text, style, ...rest }: TextProps & { variant?: Variant; color?: string }) {
  return <Text {...rest} style={[typography[variant], { color, fontVariant: ["tabular-nums"] }, style]} />;
}
