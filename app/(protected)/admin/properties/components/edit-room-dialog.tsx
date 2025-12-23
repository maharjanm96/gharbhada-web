"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
  email: string;
}

interface Room {
  id: string;
  name: string;
  price: number;
  location: string;
  floor: string;
  status: "available" | "occupied";
  tenantId: string | null;
  tenant?: Tenant | null;
}

interface EditRoomDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoomDialog({
  room,
  open,
  onOpenChange,
}: EditRoomDialogProps) {
  const queryClient = useQueryClient();
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    floor: "ground" as "ground" | "1st" | "2nd",
    status: "available" as "available" | "occupied",
    tenantId: "",
  });

  // Load room data when dialog opens
  useEffect(() => {
    if (room && open) {
      setFormData({
        name: room.name,
        price: room.price.toString(),
        location: room.location,
        floor: room.floor as "ground" | "1st" | "2nd",
        status: room.status,
        tenantId: room.tenantId || "",
      });
    }
  }, [room, open]);

  // Load tenants when dialog opens
  useEffect(() => {
    if (open) {
      fetchTenants();
    }
  }, [open]);

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/admin/tenants");
      if (response.ok) {
        const data = await response.json();
        setTenants(data.tenants || []);
      }
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
    }
  };

  // Update room mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!room) throw new Error("No room selected");

      const response = await fetch(`/api/admin/rooms/${room.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          price: parseFloat(data.price),
          location: data.location,
          floor: data.floor,
          status: data.status,
          tenantId: data.status === "occupied" ? data.tenantId : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update room");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room updated successfully");
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    if (formData.status === "occupied" && !formData.tenantId) {
      toast.error("Please select a tenant for occupied rooms");
      return;
    }

    updateMutation.mutate(formData);
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the room information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Room Name */}
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                Room Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="e.g., Room 101, Suite A"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="edit-price">
                Monthly Price <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="25000"
                  className="pl-7"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="edit-location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-location"
                placeholder="e.g., Building A, MG Road"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            {/* Floor */}
            <div className="grid gap-2">
              <Label htmlFor="edit-floor">
                Floor <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.floor}
                onValueChange={(value: "ground" | "1st" | "2nd") =>
                  setFormData({ ...formData, floor: value })
                }
              >
                <SelectTrigger id="edit-floor">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">Ground Floor</SelectItem>
                  <SelectItem value="1st">1st Floor</SelectItem>
                  <SelectItem value="2nd">2nd Floor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="edit-status">
                Room Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "available" | "occupied") =>
                  setFormData({ ...formData, status: value, tenantId: "" })
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tenant Selection (only shown when occupied) */}
            {formData.status === "occupied" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-tenant">
                  Tenant <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.tenantId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tenantId: value })
                  }
                >
                  <SelectTrigger id="edit-tenant">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No tenants available
                      </div>
                    ) : (
                      tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name} ({tenant.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
