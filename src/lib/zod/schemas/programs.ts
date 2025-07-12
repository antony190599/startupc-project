import * as z from 'zod';
import { ProgramTypes } from '@/lib/enum';

// Program creation validation schema
export const createProgramSchema = z.object({
  name: z.string().min(1, "Program name is required").max(255, "Program name must be less than 255 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
  programType: z.enum([ProgramTypes.INQUBALAB, ProgramTypes.IDEA_FEEDBACK, ProgramTypes.ACELERACION], {
    errorMap: () => ({ message: "Program type must be one of: inqubalab, idea-feedback, aceleracion" })
  }),
  programStatus: z.string().min(1, "Program status is required").max(100, "Program status must be less than 100 characters"),
  year: z.string().optional().nullable(),
  cohortCode: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable().or(z.literal("")),
  endDate: z.string().datetime().optional().nullable().or(z.literal("")),
  status: z.enum(['draft', 'published', 'inactive'], {
    errorMap: () => ({ message: "Status must be one of: draft, published, inactive" })
  }),
});

// Program update validation schema
export const updateProgramSchema = z.object({
  name: z.string().min(1, "Program name is required").max(255, "Program name must be less than 255 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters").optional(),
  programType: z.enum([ProgramTypes.INQUBALAB, ProgramTypes.IDEA_FEEDBACK, ProgramTypes.ACELERACION], {
    errorMap: () => ({ message: "Program type must be one of: inqubalab, idea-feedback, aceleracion" })
  }).optional(),
  programStatus: z.string().min(1, "Program status is required").max(100, "Program status must be less than 100 characters").optional(),
  year: z.string().optional().nullable(),
  cohortCode: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable().or(z.literal("")),
  endDate: z.string().datetime().optional().nullable().or(z.literal("")),
  status: z.enum(['draft', 'published', 'inactive'], {
    errorMap: () => ({ message: "Status must be one of: draft, published, inactive" })
  }).optional(),
});

// Program status update validation schema
export const updateProgramStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'inactive'], {
    errorMap: () => ({ message: "Status must be one of: draft, published, inactive" })
  }),
  reason: z.string().min(1, "Reason is required").max(500, "Reason must be less than 500 characters").optional(),
});

// Type exports
export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type UpdateProgramStatusInput = z.infer<typeof updateProgramStatusSchema>; 