"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createAlert } from "@/lib/actions/alerts";

// Update the CreateAlertDialog to accept default values
export function CreateAlertDialog({
  open,
  onOpenChange,
  defaultType = "weather",
  defaultSeverity = "medium",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: string;
  defaultSeverity?: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Use the default values in the initial state
  const [formData, setFormData] = useState({
    type: defaultType,
    severity: defaultSeverity,
    title: "",
    description: "",
    location: "",
    affectedPopulation: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "affectedPopulation" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSeverityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      severity: value,
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createAlert({
        type: formData.type,
        severity: formData.severity,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        affected_population: formData.affectedPopulation,
      });

      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        console.error("Failed to create alert:", result.error);
        alert("Failed to create alert: " + result.error);
      }
    } catch (error) {
      console.error("Error creating alert:", error);
      alert("An error occurred while creating the alert");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Create New Alert
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Flood Warning - Downtown Area"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Downtown District, Zone A"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the alert..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Alert Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={handleTypeChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weather" id="type-weather" />
                  <Label htmlFor="type-weather">Weather</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flood" id="type-flood" />
                  <Label htmlFor="type-flood">Flood</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="earthquake" id="type-earthquake" />
                  <Label htmlFor="type-earthquake">Earthquake</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fire" id="type-fire" />
                  <Label htmlFor="type-fire">Fire</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <RadioGroup
                value={formData.severity}
                onValueChange={handleSeverityChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="severity-low" />
                  <Label htmlFor="severity-low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="severity-medium" />
                  <Label htmlFor="severity-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="severity-high" />
                  <Label htmlFor="severity-high">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="severity-critical" />
                  <Label htmlFor="severity-critical">Critical</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affectedPopulation">Affected Population</Label>
              <Input
                id="affectedPopulation"
                name="affectedPopulation"
                type="number"
                min="0"
                placeholder="Estimated number of people affected"
                value={formData.affectedPopulation}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Estimate of people affected by this alert
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Alert"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
