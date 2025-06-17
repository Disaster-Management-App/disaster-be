"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { CreateAlertDialog } from "@/components/create-alert-dialog";

export function CreateAlertButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Send className="h-4 w-4 mr-2" />
        Create Alert
      </Button>
      <CreateAlertDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
