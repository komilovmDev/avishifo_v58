import { zodResolver } from "@hookform/resolvers/zod"
import { createMedicalFormSchema } from "@/ai-form/lib/validation"
import type { Language } from "@/ai-form/lib/translations"

export const createCustomResolver = (language: Language) => {
  return zodResolver(createMedicalFormSchema(language))
}


