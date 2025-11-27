"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateStarterLog,
  deleteStarterLog,
} from "@/app/starters/[id]/actions";

interface StarterLogItemProps {
  log: {
    id: number;
    date: Date;
    ratio: string | null;
    bakedItem: string | null;
    fermentationTime: string | null;
    notes: string | null;
  };
}

export function StarterLogItem({ log }: StarterLogItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this log?")) {
      await deleteStarterLog(log.id);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    await updateStarterLog(log.id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white rounded-lg border border-zinc-200 shadow-sm">
        <form action={handleUpdate} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor={`date-${log.id}`}>Date</Label>
            <Input
              type="date"
              id={`date-${log.id}`}
              name="date"
              defaultValue={(() => {
                const date = new Date(log.date);
                // Use UTC components to avoid timezone issues
                const year = date.getUTCFullYear();
                const month = String(date.getUTCMonth() + 1).padStart(2, "0");
                const day = String(date.getUTCDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
              })()}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`ratio-${log.id}`}>Ratio</Label>
            <Input
              type="text"
              id={`ratio-${log.id}`}
              name="ratio"
              defaultValue={log.ratio || ""}
              placeholder="e.g. 1:2:2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`bakedItem-${log.id}`}>What was made?</Label>
            <Input
              type="text"
              id={`bakedItem-${log.id}`}
              name="bakedItem"
              defaultValue={log.bakedItem || ""}
              placeholder="e.g. Sourdough Loaf"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`fermentationTime-${log.id}`}>
              Fermentation Time
            </Label>
            <Input
              type="text"
              id={`fermentationTime-${log.id}`}
              name="fermentationTime"
              defaultValue={log.fermentationTime || ""}
              placeholder="e.g. 12 hours"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`notes-${log.id}`}>Notes</Label>
            <Textarea
              id={`notes-${log.id}`}
              name="notes"
              defaultValue={log.notes || ""}
              placeholder="Notes..."
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 pb-12 bg-white rounded-lg border border-zinc-200 shadow-sm group relative">
      <div className="absolute bottom-1 left-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 px-2"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
      <div className="flex justify-between items-start mb-2 pr-20">
        <h3 className="font-semibold text-lg">{log.bakedItem || "Feeding"}</h3>
        <span className="text-sm text-zinc-500">
          {(() => {
            const date = new Date(log.date);
            // Use UTC components since date was stored as UTC midnight
            // Then create a local date to display correctly
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth();
            const day = date.getUTCDate();
            return new Date(year, month, day).toLocaleDateString();
          })()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {log.ratio && (
          <div>
            <span className="font-medium">Ratio:</span> {log.ratio}
          </div>
        )}
        {log.fermentationTime && (
          <div>
            <span className="font-medium">Fermentation:</span>{" "}
            {log.fermentationTime}
          </div>
        )}
      </div>
      {log.notes && (
        <div className="mt-2 text-sm text-zinc-600 border-t pt-2">
          {log.notes}
        </div>
      )}
    </div>
  );
}
