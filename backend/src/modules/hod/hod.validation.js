import { z } from "zod";

export const createSupervisorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  mobile: z.string().optional().nullable(),
});

export const createStudentSchema = z.object({
  name: z.string().min(1),
  register_number: z.string().min(1),
  university_email: z.string().email(),
  personal_email: z.string().email(),
  mobile: z.string().optional().nullable(),
  discipline: z.string().min(1),
  batch_id: z.string().uuid().optional().nullable(),
  campus: z.string().optional().nullable(),
  research_interests: z.array(z.string()).optional().default([]),
});

export const createBatchSchema = z.object({
  name: z.string().min(1),
  year: z.number().int().min(2000),
  cycle: z.number().int().min(1).max(4),
});

export const assignSupervisorSchema = z.object({
  student_id: z.string().uuid(),
  supervisor_id: z.string().uuid(),
});

export const bulkStudentSchema = z.array(createStudentSchema);
export const bulkSupervisorSchema = z.array(createSupervisorSchema);