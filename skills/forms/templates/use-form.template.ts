/**
 * useForm Hook Template
 * 
 * React Hook Form configuration with validation
 * Keep in: forms/[entity]/use-[entity]-form.ts
 * 
 * Replace: [Entity] → Product, User, Order
 * Replace: [entity] → product, user, order
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  create[Entity]Schema, 
  Create[Entity]FormData,
  createZodValidator,
  Validator 
} from './form.schema';
import { [entity]Repository } from '@/features/[entities]/infrastructure/repositories/[entity].repository';
import { QUERY_KEYS } from '@/features/[entities]/domain/types';

// =============================================================================
// Form Hook
// =============================================================================

/**
 * Hook for creating a new [Entity]
 * 
 * Features:
 * - Zod validation via resolver
 * - Mode: onBlur (validate on blur)
 * - ReValidateMode: onChange (after first submit)
 * - Integration ready for mutation
 */
export function useCreate[Entity]Form() {
  const queryClient = useQueryClient();
  
  const form = useForm<Create[Entity]FormData>({
    resolver: zodResolver(create[Entity]Schema),
    mode: 'onBlur',              // Validate when field loses focus
    reValidateMode: 'onChange', // After first submit, validate on change
    shouldUnregister: true,      // Clean up on unmount
    shouldFocusError: true,      // Focus first error on submit
    defaultValues: {
      name: '',
      email: '',
      description: '',
      price: 0,
      status: 'draft',
      isActive: true,
      expiresAt: '',
    },
  });

  // Custom validator (for advanced use cases)
  const validator: Validator<Create[Entity]FormData> = createZodValidator(create[Entity]Schema);

  // Mutation for creating entity
  const mutation = useMutation({
    mutationFn: async (data: Create[Entity]FormData) => {
      // Optional: validate with adapter before mutation
      const result = validator.safeParse(data);
      if (!result.success) {
        throw new Error('Validation failed');
      }
      return [entity]Repository.create[Entity](result.data);
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].all });
      // Reset form
      form.reset();
    },
    onError: (error) => {
      // Handle error
      console.error('Create failed:', error);
    },
  });

  // Submit handler
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      // Server-side errors handled in catch
      // For 409 conflicts, set field error:
      // form.setError('name', { message: 'Already exists' });
    }
  });

  // Helper: show error only if field was touched
  const showError = (field: keyof Create[Entity]FormData) => {
    return form.formState.touchedFields[field] && form.formState.errors[field];
  };

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    showError,
    // For manual validation if needed
    validate: (data: Create[Entity]FormData) => {
      return validator.safeParse(data);
    },
  };
}

/**
 * Hook for updating an existing [Entity]
 */
export function useUpdate[Entity]Form(initialData: Create[Entity]FormData & { id: string }) {
  const queryClient = useQueryClient();
  
  const form = useForm<Create[Entity]FormData>({
    resolver: zodResolver(create[Entity]Schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: initialData,
  });

  const mutation = useMutation({
    mutationFn: async (data: Create[Entity]FormData) => {
      return [entity]Repository.update[Entity](initialData.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].detail(initialData.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].all });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      // Handle server errors
    }
  });

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}

/**
 * Hook for delete confirmation
 */
export function useDelete[Entity]Form([entity]Name: string) {
  const queryClient = useQueryClient();
  
  const form = useForm({
    defaultValues: {
      confirmName: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return [entity]Repository.delete[Entity](id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.[entities].all });
    },
  });

  const onConfirm = form.handleSubmit(async () => {
    const confirmName = form.getValues('confirmName');
    if (confirmName !== [entity]Name) {
      form.setError('confirmName', { message: 'Name does not match' });
      return;
    }
    
    try {
      await mutation.mutateAsync([entity]Name);
    } catch (error) {
      // Handle error
    }
  });

  return {
    form,
    onConfirm,
    isLoading: mutation.isPending,
  };
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * // Basic usage:
 * const { form, onSubmit, isLoading } = useCreate[Entity]Form();
 * 
 * <form onSubmit={onSubmit}>
 *   <FormField name="name" render={({ field }) => (
 *     <Input {...field} />
 *   )} />
 * </form>
 * 
 * // With error display:
 * {form.formState.touchedFields.name && form.formState.errors.name && (
 *   <p>{form.formState.errors.name.message}</p>
 * )}
 * 
 * // With loading:
 * <Button disabled={isLoading}>
 *   {isLoading ? 'Saving...' : 'Save'}
 * </Button>
 */
