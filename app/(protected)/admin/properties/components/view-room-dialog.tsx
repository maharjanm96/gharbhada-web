"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, DollarSign, MapPin, User } from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  email: string;
  contact?: string;
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
  createdAt: string;
  updatedAt: string;
}

interface ViewRoomDialogProps {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewRoomDialog({
  room,
  open,
  onOpenChange,
}: ViewRoomDialogProps) {
  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Room Details</DialogTitle>
          <DialogDescription>
            View comprehensive information about this room
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>{room.location}</span>
                </div>
              </div>
              {room.status === "occupied" ? (
                <Badge className="bg-green-600">Occupied</Badge>
              ) : (
                <Badge variant="outline">Available</Badge>
              )}
            </div>

            <Separator />

            {/* Room Details */}
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <DollarSign className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Monthly Rent</p>
                  <p className="text-lg font-semibold">
                    ₹{room.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Floor</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {room.floor === "ground"
                      ? "Ground Floor"
                      : room.floor === "1st"
                      ? "1st Floor"
                      : "2nd Floor"}
                  </p>
                </div>
              </div>

              {/* Tenant Information */}
              {room.tenant && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-3 text-sm font-semibold">
                      Tenant Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          <User className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {room.tenant.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {room.tenant.email}
                          </p>
                        </div>
                      </div>
                      {room.tenant.contact && (
                        <div className="ml-[52px]">
                          <p className="text-sm font-medium">Contact</p>
                          <p className="text-sm text-muted-foreground">
                            {room.tenant.contact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Calendar className="size-4" />
              <div>
                Created: {new Date(room.createdAt).toLocaleDateString()} •
                Updated: {new Date(room.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
