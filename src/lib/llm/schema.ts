import { z } from "zod";

const mealSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  proteinG: z.number(),
  notes: z.string().optional(),
});

export const planSchema = z.object({
  summary: z.string(),
  menu: z
    .array(
      z.object({
        day: z.number(),
        isRefeed: z.boolean(),
        meals: z.array(mealSchema).min(2).max(5),
      }),
    )
    .min(7)
    .max(14),
  shoppingList: z.array(
    z.object({
      item: z.string(),
      amount: z.string(),
      aisle: z.string().optional(),
    }),
  ),
  refeedDays: z.array(
    z.object({
      day: z.number(),
      carbsG: z.number(),
      instruction: z.string(),
    }),
  ),
  workouts: z.array(
    z.object({
      name: z.string(),
      when: z.string(),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.string(),
          reps: z.string(),
        }),
      ),
    }),
  ),
  exitPlan: z.object({
    days: z.number(),
    startCalories: z.number(),
    targetCalories: z.number(),
    steps: z.array(z.string()),
  }),
  tips: z.array(z.string()),
  supplements: z.array(z.string()),
});

export type GeneratedPlan = z.infer<typeof planSchema>;
