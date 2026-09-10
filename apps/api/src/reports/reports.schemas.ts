import { z } from 'zod';

export const salesReportQuerySchema = z.object({
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
});

export type SalesReportQueryInput = z.infer<typeof salesReportQuerySchema>;

export class SalesReportQueryDto {
  static schema = salesReportQuerySchema;
  startDate?: string;
  endDate?: string;
}
