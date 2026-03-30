// Hook Config — LOAD: when configuring useForm
// ~12 lines → ~250 bytes

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { [entity]Schema, [Entity]FormData } from './schema-skeleton';

export function use[Entity]Form() {
  return useForm<[Entity]FormData>({
    resolver: zodResolver([entity]Schema),
    mode: 'onBlur',            // Validate on blur (NOT onChange)
    reValidateMode: 'onChange', // After submit, validate on change
    defaultValues: { name: '', email: '', status: 'draft' },
  });
}
