"use client";

import { LoadingIcon } from "@/components/loading-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, DollarSign, Home, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddRoomDialog } from "./components/add-room-dialog";
import { EditRoomDialog } from "./components/edit-room-dialog";
import { RoomsTable } from "./components/rooms-table";
import { ViewRoomDialog } from "./components/view-room-dialog";

interface Room {
  id: string;
  name: string;
  price: number;
  location: string;
  floor: string;
  status: "available" | "occupied";
  tenantId: string | null;
  tenant?: {
    id: string;
    name: string;
    email: string;
    contact?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface RoomsResponse {
  success: boolean;
  rooms: Room[];
}

export default function PropertiesPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);
  const [viewRoom, setViewRoom] = useState<Room | null>(null);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  // Fetch rooms
  const { data, isLoading, error, refetch } = useQuery<RoomsResponse>({
    queryKey: ["rooms", statusFilter],
    queryFn: async () => {
      const url =
        statusFilter === "all"
          ? "/api/admin/rooms"
          : `/api/admin/rooms?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      return response.json();
    },
  });

  // Delete room mutation
  const deleteMutation = useMutation({
    mutationFn: async (roomId: string) => {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete room");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room deleted successfully");
      setDeleteRoomId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const rooms = data?.rooms || [];

  // Calculate stats
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  const availableRooms = rooms.filter((r) => r.status === "available").length;
  const totalRevenue = rooms
    .filter((r) => r.status === "occupied")
    .reduce((sum, r) => sum + r.price, 0);
  const occupancyRate =
    totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : "0";

  const handleRoomAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIcon />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load rooms</p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="mr-2 size-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <main className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor your room portfolio
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className="size-4" />
            </Button>
            <AddRoomDialog onRoomAdded={handleRoomAdded} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Building2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRooms}</div>
              <p className="text-xs text-muted-foreground">
                {occupiedRooms} occupied, {availableRooms} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Occupied</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupiedRooms}</div>
              <p className="text-xs text-muted-foreground">
                {occupancyRate}% occupancy rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Home className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableRooms}</div>
              <p className="text-xs text-muted-foreground">Ready for tenants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">
                From occupied rooms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Table */}
        <RoomsTable
          rooms={rooms}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onViewRoom={setViewRoom}
          onEditRoom={setEditRoom}
          onDeleteRoom={setDeleteRoomId}
          onRoomAdded={handleRoomAdded}
        />
      </main>

      {/* View Room Dialog */}
      <ViewRoomDialog
        room={viewRoom}
        open={!!viewRoom}
        onOpenChange={(open) => !open && setViewRoom(null)}
      />

      {/* Edit Room Dialog */}
      <EditRoomDialog
        room={editRoom}
        open={!!editRoom}
        onOpenChange={(open) => !open && setEditRoom(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteRoomId}
        onOpenChange={() => setDeleteRoomId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              room from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteRoomId && deleteMutation.mutate(deleteRoomId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
