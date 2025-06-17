"use client";

import { BroadcastButton } from "./broadcast-button";
import { Bell, Users, CheckCircle } from "lucide-react";

type IconType = "bell" | "users" | "checkCircle";

interface BroadcastButtonWrapperProps {
  iconType: IconType;
  label: string;
  alertType: string;
  severity: string;
}

export function BroadcastButtonWrapper({
  iconType,
  label,
  alertType,
  severity,
}: BroadcastButtonWrapperProps) {
  // Map string icon names to actual icon components
  const getIcon = () => {
    switch (iconType) {
      case "bell":
        return Bell;
      case "users":
        return Users;
      case "checkCircle":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const Icon = getIcon();

  return (
    <BroadcastButton
      icon={Icon}
      label={label}
      alertType={alertType}
      severity={severity}
    />
  );
}
