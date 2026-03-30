// Minimal Template — USE: for quick form generation
// ~30 lines → ~600 bytes

'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 1. SCHEMA
const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

// 2. HOOK
function useLoginForm() {
  const form = useForm({ resolver: zodResolver(schema), mode: 'onBlur' });
  const onSubmit = form.handleSubmit(async (data) => {
    await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) });
    form.reset();
  });
  return { form, onSubmit };
}

// 3. COMPONENT
export function LoginForm() {
  const { form, onSubmit } = useLoginForm();
  return (
    <form onSubmit={onSubmit}>
      <Input {...form.register('name')} />
      {form.formState.errors.name && <span>{form.formState.errors.name.message}</span>}
      <Input {...form.register('email')} />
      {form.formState.errors.email && <span>{form.formState.errors.email.message}</span>}
      <Button type="submit">Submit</Button>
    </form>
  );
}
