import { z } from "zod";

export const inputvalues = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export interface courseStructure {
  title?: string;
  description?: string;
  price?: number;
  imageLink?: string;
  published?: boolean;
  CourseId?: number;
}
