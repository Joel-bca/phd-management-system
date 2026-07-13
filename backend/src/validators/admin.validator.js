 import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),

  register_number: z.string().min(3),
  university_email: z.string().email(),

  personal_email: z.string().email().optional(),
  mobile: z.string().min(8).max(15).optional(),

  discipline: z.string().min(2),

  research_interests: z.array(z.string()).optional(),

  proposed_title: z.string().optional(),
  campus: z.string().optional(),

  batch_id: z.string().uuid(),
});

export const createSupervisorSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(8).max(15).optional(),
});

export const assignSupervisorSchema = z.object({
  student_id: z.string().uuid(),
  supervisor_id: z.string().uuid(),
});