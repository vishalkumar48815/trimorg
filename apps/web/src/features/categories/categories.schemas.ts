import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required.').max(120),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
