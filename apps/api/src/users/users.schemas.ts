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

export const createTeamMemberSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required.').max(100),
  email: z.string().trim().email('Enter a valid email address.').toLowerCase(),
  mobile: z.string().trim().min(7, 'Enter a valid mobile number.').max(30),
  role: z.enum(['ADMIN', 'STAFF']),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export class CreateTeamMemberDto {
  static schema = createTeamMemberSchema;
  fullName!: string;
  email!: string;
  mobile!: string;
  role!: 'ADMIN' | 'STAFF';
  password!: string;
}

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;

export const updateTeamMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'STAFF']),
});

export class UpdateTeamMemberRoleDto {
  static schema = updateTeamMemberRoleSchema;
  role!: 'ADMIN' | 'STAFF';
}

export type UpdateTeamMemberRoleInput = z.infer<typeof updateTeamMemberRoleSchema>;

export const teamMemberIdSchema = z.object({
  id: z.string().trim().min(1, 'Member ID is required.'),
});

export class TeamMemberIdDto {
  static schema = teamMemberIdSchema;
  id!: string;
}

export type TeamMemberIdInput = z.infer<typeof teamMemberIdSchema>;
