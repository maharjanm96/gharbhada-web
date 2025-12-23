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
  DropdownMenuSeparator,
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
import {
  Building2,
  Edit,
  Eye,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { AddRoomDialog } from "./add-room-dialog";

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

interface RoomsTableProps {
  rooms: Room[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onViewRoom: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  onRoomAdded: () => void;
}

export function RoomsTable({
  rooms,
  statusFilter,
  onStatusFilterChange,
  onViewRoom,
  onEditRoom,
  onDeleteRoom,
  onRoomAdded,
}: RoomsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All Rooms</CardTitle>
            <CardDescription>
              View and manage your room inventory
            </CardDescription>
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No rooms found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {statusFilter === "all"
                ? "Get started by adding your first room"
                : `No ${statusFilter} rooms found`}
            </p>
            {statusFilter === "all" && (
              <AddRoomDialog onRoomAdded={onRoomAdded} />
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3 text-muted-foreground" />
                        <span className="text-sm">{room.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">
                        {room.floor === "ground"
                          ? "Ground Floor"
                          : room.floor === "1st"
                          ? "1st Floor"
                          : "2nd Floor"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {room.tenant ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {room.tenant.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {room.tenant.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{room.price.toLocaleString("en-IN")}/mo
                    </TableCell>
                    <TableCell>
                      {room.status === "occupied" ? (
                        <Badge className="bg-green-600">Occupied</Badge>
                      ) : (
                        <Badge variant="outline">Available</Badge>
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
                          <DropdownMenuItem onClick={() => onViewRoom(room)}>
                            <Eye className="mr-2 size-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditRoom(room)}>
                            <Edit className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDeleteRoom(room.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
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
