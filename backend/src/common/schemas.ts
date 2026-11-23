import { z } from 'zod';
import { Category, BillingCycle, ItemStatus } from './enums.js';

export const CreateTrackedItemSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(100),
  category: z.nativeEnum(Category),
  templateKey: z.string().optional(),
  amount: z.number().min(0, 'Amount cannot be negative').optional(),
  billingCycle: z.nativeEnum(BillingCycle).default(BillingCycle.MONTHLY),
  nextDueDate: z.coerce.date(),
  reminderDaysBefore: z.array(z.number().int().positive()).default([7, 1]),
  notes: z.string().max(500).optional(),
  cancelUrl: z.string().url().optional().or(z.literal('')),
});

export const UpdateTrackedItemSchema = CreateTrackedItemSchema.partial().extend({
  status: z.nativeEnum(ItemStatus).optional(),
});

export const RenewItemSchema = z.object({
  paidAmount: z.number().min(0).optional(),
});

export const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  authProvider: z.enum(['email', 'google', 'apple']).default('email'),
  currencyCode: z.string().default('IDR'),
  timezone: z.string().default('Asia/Jakarta'),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AnalyticsSummarySchema = z.object({
  estMonthlySpend: z.number(),
  annualizedSpend: z.number(),
  dueThisMonth: z.number(),
  upcoming90DaysSpikes: z.array(
    z.object({
      month: z.string(),
      amount: z.number(),
      diffFromAverage: z.number(),
      reasons: z.array(z.string()),
    })
  ),
  categoryBreakdown: z.object({
    subscriptionPercentage: z.number(),
    billIdPercentage: z.number(),
    warrantyPercentage: z.number(),
  }),
});

export type CreateTrackedItemDto = z.infer<typeof CreateTrackedItemSchema>;
export type UpdateTrackedItemDto = z.infer<typeof UpdateTrackedItemSchema>;
export type RenewItemDto = z.infer<typeof RenewItemSchema>;
export type UserRegisterDto = z.infer<typeof UserRegisterSchema>;
export type UserLoginDto = z.infer<typeof UserLoginSchema>;
export type AnalyticsSummaryDto = z.infer<typeof AnalyticsSummarySchema>;
