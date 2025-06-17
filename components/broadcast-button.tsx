"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { CreateAlertDialog } from "./create-alert-dialog";

interface BroadcastButtonProps {
  icon: LucideIcon;
  label: string;
  alertType: string;
  severity: string;
}

export function BroadcastButton({
  icon: Icon,
  label,
  alertType,
  severity,
}: BroadcastButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="h-20 flex flex-col items-center justify-center"
        onClick={() => setOpen(true)}
      >
        <Icon className="h-6 w-6 mb-2" />
        <span>{label}</span>
      </Button>
      <CreateAlertDialog
        open={open}
        onOpenChange={setOpen}
        defaultType={alertType}
        defaultSeverity={severity}
      />
    </>
  );
}
