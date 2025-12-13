"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface EditStarterDialogProps {
  starterId: number;
  starterName: string;
  starterNotes: string | null;
  renameStarter: (starterId: number, formData: FormData) => Promise<void>;
  deleteStarter: (starterId: number) => Promise<void>;
}

export function EditStarterDialog({
  starterId,
  starterName,
  starterNotes,
  renameStarter,
  deleteStarter,
}: EditStarterDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await renameStarter(starterId, formData);
        toast.success("Starter updated successfully!");
        setOpen(false);
      } catch (error) {
        toast.error("Failed to update starter");
        console.error(error);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this starter?")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteStarter(starterId);
        toast.success("Starter deleted successfully!");
        setOpen(false);
      } catch (error) {
        toast.error("Failed to delete starter");
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Starter</DialogTitle>
          <DialogDescription>
            Make changes to your starter here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              name="name"
              placeholder="Starter Name"
              required
              defaultValue={starterName}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              name="notes"
              placeholder="Add any notes about this starter..."
              rows={3}
              defaultValue={starterNotes || ""}
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete Starter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
