import { z } from 'zod';

export const userSchema = z.object({
    firstname: z.string().min(1, "Le prénom est requis").trim(),
    lastname: z.string().min(1, "Le nom est requis").trim(),
    role: z.string().min(1, "Le role est requis").trim(),
    phone_number: z.string()
      .min(1, "Le numéro de téléphone est requis")
      .regex(/^\+?[0-9\s-]{7,15}$/, "Numéro invalide")
      .trim(),
    email: z.string().email("Email invalide").trim()

    
  });
  export type UserInput = z.infer<typeof userSchema>;
