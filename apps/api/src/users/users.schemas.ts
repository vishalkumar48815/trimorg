import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.').max(100),
  mobile: z.string().trim().min(7, 'Enter a valid mobile number.').max(30),
});

export class UpdateProfileDto {
  static schema = updateProfileSchema;
  fullName!: string;
  mobile!: string;
}

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
