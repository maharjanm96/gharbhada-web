"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  location: string;
  floor: string;
  price: number;
  status: string;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
  contact?: string | null;
  roomId?: string | null;
  room?: {
    id: string;
    name: string;
    location: string;
    floor: string;
    price: number;
  } | null;
  status: string;
}

interface EditTenantDialogProps {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantUpdated: () => void;
}

export function EditTenantDialog({
  tenant,
  open,
  onOpenChange,
  onTenantUpdated,
}: EditTenantDialogProps) {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [fetchingRooms, setFetchingRooms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    roomId: "",
    status: "active",
    newPassword: "",
    confirmPassword: "",
  });

  // Update form data when tenant changes
  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        email: tenant.email,
        contact: tenant.contact || "",
        roomId: tenant.roomId || "",
        status: tenant.status,
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [tenant]);

  // Fetch available rooms when dialog opens
  useEffect(() => {
    if (open) {
      fetchAvailableRooms();
    }
  }, [open]);

  const fetchAvailableRooms = async () => {
    setFetchingRooms(true);
    try {
      const response = await fetch("/api/admin/rooms?status=available");
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      toast.error("Failed to load available rooms");
    } finally {
      setFetchingRooms(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    // Validate passwords match if provided
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        contact: formData.contact || undefined,
        roomId: formData.roomId || undefined,
        status: formData.status,
      };

      // Only include password if it's provided
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await fetch(`/api/admin/tenants/${tenant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update tenant");
      }

      toast.success("Tenant updated successfully");
      onOpenChange(false);
      onTenantUpdated();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
          <DialogDescription>
            Update the tenant details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Full Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-contact">Contact Number</Label>
            <Input
              id="edit-contact"
              type="tel"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-newPassword">
              New Password (leave blank to keep current)
            </Label>
            <Input
              id="edit-newPassword"
              type="password"
              placeholder="Min. 6 characters"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              minLength={6}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-confirmPassword">Confirm New Password</Label>
            <Input
              id="edit-confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              minLength={6}
            />
            {formData.newPassword &&
              formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="text-xs text-destructive">
                  Passwords don't match
                </p>
              )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-roomId">Assign Room</Label>
            <Select
              value={formData.roomId || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  roomId: value === "none" ? "" : value,
                })
              }
              disabled={fetchingRooms}
            >
              <SelectTrigger id="edit-roomId">
                <SelectValue
                  placeholder={
                    fetchingRooms ? "Loading rooms..." : "Select a room"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No room</SelectItem>
                {tenant?.room && (
                  <SelectItem value={tenant.room.id}>
                    {tenant.room.name} - {tenant.room.location} (Current)
                  </SelectItem>
                )}
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - {room.location} (
                    {room.floor === "ground"
                      ? "Ground"
                      : room.floor === "1st"
                      ? "1st"
                      : "2nd"}{" "}
                    Floor) - ₹{room.price.toLocaleString("en-IN")}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
