import { z } from "zod";

export const createMeetingSchema = z.object({
  student_ids: z.array(z.string()).min(1),
  meeting_number: z.number().min(1),
  meeting_date: z.string().optional(),
  meeting_mode: z.enum(["online", "offline"]).optional(),
  meeting_subject: z.string().optional(),
  meeting_location: z.string().optional(),
  meeting_message: z.string().optional(),
  send_email: z.boolean().optional(),
});

export const updateMeetingSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled"]).optional(),
  remarks: z.string().optional(),
  meeting_date: z.string().optional(),
  meeting_subject: z.string().optional(),
  meeting_location: z.string().optional(),
  meeting_mode: z.enum(["online", "offline"]).optional(),
  kp_upload_date: z.string().optional().nullable(),
  publication_title: z.string().optional().nullable(),
  journal_details: z.string().optional().nullable(),
});