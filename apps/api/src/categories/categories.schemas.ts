import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required.').max(120),
});

export class CreateCategoryDto {
  static schema = createCategorySchema;
  name!: string;
}

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
