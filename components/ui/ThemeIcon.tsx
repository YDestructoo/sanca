import React from "react";
import { useColorScheme } from "react-native";
import * as Icons from "lucide-react-native";
import { LucideIcon } from "lucide-react-native";
import { THEME } from "@/lib/theme";

type ThemedIconProps = {
  name: keyof typeof Icons;
  size?: number;
  colorKey?: keyof typeof THEME.light;
  overrideColor?: string;
};

export function ThemedIcon({
  name,
  size = 24,
  colorKey = "foreground",
  overrideColor,
}: ThemedIconProps) {
  const scheme = useColorScheme();
  const palette = THEME[scheme ?? "light"]; // full theme
  const IconComponent = Icons[name] as LucideIcon;

  const color = overrideColor ?? palette[colorKey];

  return <IconComponent size={size} color={color} />;
}