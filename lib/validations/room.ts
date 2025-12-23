import { z } from "zod";

export const roomCreateSchema = z.object({
  name: z.string().min(1, "Room name is required").max(100),
  price: z.number().positive("Price must be greater than 0"),
  location: z.string().min(1, "Location is required").max(500),
  floor: z.enum(["ground", "1st", "2nd"]).default("ground"),
  status: z.enum(["available", "occupied"]).default("available"),
});

export const roomUpdateSchema = z.object({
  name: z.string().min(1, "Room name is required").max(100).optional(),
  price: z.number().positive("Price must be greater than 0").optional(),
  location: z.string().min(1, "Location is required").max(500).optional(),
  floor: z.enum(["ground", "1st", "2nd"]).optional(),
  status: z.enum(["available", "occupied"]).optional(),
});

export type RoomCreateInput = z.infer<typeof roomCreateSchema>;
export type RoomUpdateInput = z.infer<typeof roomUpdateSchema>;
