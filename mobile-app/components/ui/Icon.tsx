import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import { colors } from "../../theme/colors";

type Props = Omit<ComponentProps<typeof MaterialIcons>, "name"> & {
  name: ComponentProps<typeof MaterialIcons>["name"];
  label?: string;
};

export function Icon({ name, size = 24, color = colors.ink, label, ...props }: Props) {
  return <MaterialIcons accessibilityLabel={label} size={size} color={color} {...props} name={name} />;
}
