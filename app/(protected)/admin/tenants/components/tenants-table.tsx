"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/lib/helpers";
import {
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import { AddTenantDialog } from "./add-tenant-dialog";

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

interface TenantsTableProps {
  tenants: Tenant[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onViewTenant: (tenant: Tenant) => void;
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (tenantId: string) => void;
  onTenantAdded: () => void;
}

export function TenantsTable({
  tenants,
  statusFilter,
  onStatusFilterChange,
  onViewTenant,
  onEditTenant,
  onDeleteTenant,
  onTenantAdded,
}: TenantsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All Tenants</CardTitle>
            <CardDescription>
              View and manage your tenant information
            </CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {tenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No tenants found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {statusFilter === "all"
                ? "Get started by adding your first tenant"
                : `No ${statusFilter} tenants found`}
            </p>
            {statusFilter === "all" && (
              <AddTenantDialog onTenantAdded={onTenantAdded} />
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {getInitials(tenant.name)}
                        </div>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="size-3" />
                            {tenant.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tenant.contact ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-3 text-muted-foreground" />
                          {tenant.contact}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tenant.room ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="size-3 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {tenant.room.name}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {tenant.room.location} •{" "}
                            {tenant.room.floor === "ground"
                              ? "Ground"
                              : tenant.room.floor === "1st"
                              ? "1st"
                              : "2nd"}{" "}
                            Floor • ₹{tenant.room.price.toLocaleString("en-IN")}
                            /mo
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No room assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tenant.status === "active" ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : tenant.status === "inactive" ? (
                        <Badge variant="secondary">Inactive</Badge>
                      ) : (
                        <Badge variant="destructive">Suspended</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewTenant(tenant)}
                          >
                            <Eye className="mr-2 size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEditTenant(tenant)}
                          >
                            <Edit className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:text-destructive text-red-500"
                            onClick={() => onDeleteTenant(tenant.id)}
                          >
                            <Trash2 className="mr-2 size-4" color="red" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
