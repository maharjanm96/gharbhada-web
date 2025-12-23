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
import { FileText, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddTenantDialog } from "./components/add-tenant-dialog";
import { EditTenantDialog } from "./components/edit-tenant-dialog";
import { TenantsTable } from "./components/tenants-table";
import { ViewTenantDialog } from "./components/view-tenant-dialog";

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

interface TenantsResponse {
  success: boolean;
  tenants: Tenant[];
}

export default function TenantsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteTenantId, setDeleteTenantId] = useState<string | null>(null);
  const [viewTenant, setViewTenant] = useState<Tenant | null>(null);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch tenants
  const { data, isLoading, error, refetch } = useQuery<TenantsResponse>({
    queryKey: ["tenants", statusFilter],
    queryFn: async () => {
      const url =
        statusFilter === "all"
          ? "/api/admin/tenants"
          : `/api/admin/tenants?status=${statusFilter}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch tenants");
      }
      return response.json();
    },
  });

  // Delete tenant mutation
  const deleteMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      const response = await fetch(`/api/admin/tenants/${tenantId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete tenant");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Tenant deleted successfully");
      setDeleteTenantId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const tenants = data?.tenants || [];

  // Calculate stats
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const tenantsWithRooms = tenants.filter((t) => t.roomId).length;

  const handleViewTenant = (tenant: Tenant) => {
    setViewTenant(tenant);
    setViewDialogOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditTenant(tenant);
    setEditDialogOpen(true);
  };

  const handleTenantUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  };
  const handleTenantAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["tenants"] });
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
        <p className="text-destructive">Failed to load tenants</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
            <p className="text-sm text-muted-foreground">
              Manage your tenant relationships and information
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
            <AddTenantDialog onTenantAdded={handleTenantAdded} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tenants
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTenants}</div>
              <p className="text-xs text-muted-foreground">
                {activeTenants} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tenants
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTenants}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Rooms
              </CardTitle>
              <FileText className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tenantsWithRooms}</div>
              <p className="text-xs text-muted-foreground">
                With room assignments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tenants Table */}
        <TenantsTable
          tenants={tenants}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onViewTenant={handleViewTenant}
          onEditTenant={handleEditTenant}
          onDeleteTenant={setDeleteTenantId}
          onTenantAdded={handleTenantAdded}
        />
      </main>

      {/* View Tenant Dialog */}
      <ViewTenantDialog
        tenant={viewTenant}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      {/* Edit Tenant Dialog */}
      <EditTenantDialog
        tenant={editTenant}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onTenantUpdated={handleTenantUpdated}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTenantId}
        onOpenChange={() => setDeleteTenantId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tenant from your database. If the tenant has an assigned room, it
              will be set to available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteTenantId && deleteMutation.mutate(deleteTenantId)
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
