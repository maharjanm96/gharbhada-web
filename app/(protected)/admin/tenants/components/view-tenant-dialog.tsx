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
import { Mail, MapPin, Phone } from "lucide-react";

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
  createdAt: string;
  updatedAt: string;
}

interface ViewTenantDialogProps {
  tenant: Tenant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewTenantDialog({
  tenant,
  open,
  onOpenChange,
}: ViewTenantDialogProps) {
  if (!tenant) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tenant Details</DialogTitle>
          <DialogDescription>
            View complete information about this tenant.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tenant Info */}
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-medium text-primary">
              {getInitials(tenant.name)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{tenant.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {tenant.status === "active" ? (
                  <Badge className="bg-green-600">Active</Badge>
                ) : tenant.status === "inactive" ? (
                  <Badge variant="secondary">Inactive</Badge>
                ) : (
                  <Badge variant="destructive">Suspended</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{tenant.email}</p>
                </div>
              </div>
              {tenant.contact && (
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{tenant.contact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Room Assignment */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Room Assignment
            </h4>
            {tenant.room ? (
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{tenant.room.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tenant.room.location}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Floor:{" "}
                        {tenant.room.floor === "ground"
                          ? "Ground"
                          : tenant.room.floor === "1st"
                          ? "1st"
                          : "2nd"}
                      </span>
                      <span>•</span>
                      <span className="font-medium text-foreground">
                        ₹{tenant.room.price.toLocaleString("en-IN")}/month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No room assigned
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Additional Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created On</p>
                <p className="font-medium">{formatDate(tenant.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(tenant.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
