"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddRoomDialogProps {
  onRoomAdded?: () => void;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
}

export function AddRoomDialog({ onRoomAdded }: AddRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    roomName: "",
    price: "",
    location: "",
    floor: "ground" as "ground" | "1st" | "2nd",
    status: "available" as "available" | "occupied",
    tenantId: "",
  });

  // Load tenants when dialog opens
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Fetch available tenants
      try {
        const response = await fetch("/api/admin/tenants");
        if (response.ok) {
          const data = await response.json();
          setTenants(data.tenants || []);
        }
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.roomName.trim()) {
        toast.error("Please enter a room name");
        setLoading(false);
        return;
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("Please enter a valid price");
        setLoading(false);
        return;
      }

      if (!formData.location.trim()) {
        toast.error("Please enter a location");
        setLoading(false);
        return;
      }

      if (formData.status === "occupied" && !formData.tenantId) {
        toast.error("Please select a tenant for occupied rooms");
        setLoading(false);
        return;
      }

      // Call API to create room
      const response = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.roomName,
          price: parseFloat(formData.price),
          location: formData.location,
          floor: formData.floor,
          status: formData.status,
          tenantId: formData.status === "occupied" ? formData.tenantId : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create room");
        setLoading(false);
        return;
      }

      toast.success("Room added successfully");

      // Reset form
      setFormData({
        roomName: "",
        price: "",
        location: "",
        floor: "ground",
        status: "available",
        tenantId: "",
      });

      setOpen(false);
      onRoomAdded?.();
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("Failed to add room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Fill in the room details to add it to your property.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Room Name */}
            <div className="grid gap-2">
              <Label htmlFor="roomName">
                Room Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="roomName"
                placeholder="e.g., Room 101, Suite A"
                value={formData.roomName}
                onChange={(e) =>
                  setFormData({ ...formData, roomName: e.target.value })
                }
                required
              />
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">
                Monthly Price <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="price"
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
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
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
              <Label htmlFor="floor">
                Floor <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.floor}
                onValueChange={(value: "ground" | "1st" | "2nd") =>
                  setFormData({ ...formData, floor: value })
                }
              >
                <SelectTrigger id="floor">
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
              <Label htmlFor="status">
                Room Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "available" | "occupied") =>
                  setFormData({ ...formData, status: value, tenantId: "" })
                }
              >
                <SelectTrigger id="status">
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
                <Label htmlFor="tenant">
                  Tenant <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.tenantId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tenantId: value })
                  }
                >
                  <SelectTrigger id="tenant">
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
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
