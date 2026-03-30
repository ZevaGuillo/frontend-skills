/**
 * Form + Mutation Integration Template
 * 
 * Complete form with mutation integration
 * Keep in: forms/[entity]/[Entity]Form.tsx
 * 
 * Replace: [Entity] → Product, User, Order
 * Replace: [entity] → product, user, order
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  create[Entity]Schema,
  Create[Entity]FormData,
  createZodValidator,
} from './schema';
import { useCreate[Entity]Form } from './use-[entity]-form';

// =============================================================================
// Create/Update Form Component
// =============================================================================

export function [Entity]Form({ 
  initialData,
  onSuccess,
}: {
  initialData?: Create[Entity]FormData & { id: string };
  onSuccess?: () => void;
} = {}) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  // Use appropriate hook based on create/edit
  const { form, onSubmit, isLoading, isSuccess, error } = 
    isEdit 
      ? useUpdate[Entity]Form(initialData)
      : useCreate[Entity]Form();

  // Handle success
  React.useEffect(() => {
    if (isSuccess) {
      toast.success(isEdit ? '[Entity] updated' : '[Entity] created');
      onSuccess?.();
      
      if (!isEdit) {
        form.reset();
      }
    }
  }, [isSuccess, isEdit, form, onSuccess]);

  // Handle error
  React.useEffect(() => {
    if (error) {
      // Handle specific error codes
      if (error.response?.status === 409) {
        form.setError('name', {
          message: error.response?.data?.message || 'Name already exists',
        });
      } else if (error.response?.status === 422) {
        // Server validation errors
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          Object.keys(serverErrors).forEach(field => {
            form.setError(field as keyof Create[Entity]FormData, {
              message: serverErrors[field],
            });
          });
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  }, [error, form]);

  return (
    <Form {...form.form}>
      <form onSubmit={form.form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Field */}
        <FormField
          control={form.form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter [entity] name"
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                The name will be displayed in the system.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="email@example.com"
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field (number) */}
        <FormField
          control={form.form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={field.value ?? 0}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Select */}
        <FormField
          control={form.form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Category <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Select */}
        <FormField
          control={form.form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Textarea */}
        <FormField
          control={form.form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter description"
                  rows={4}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription>
                Optional. Maximum 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Checkbox */}
        <FormField
          control={form.form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <FormDescription>
                  Inactive items won't be visible in the system.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (isEdit ? 'Updating...' : 'Creating...') 
              : (isEdit ? 'Update [Entity]' : 'Create [Entity]')
            }
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

// =============================================================================
// Delete Confirmation Form
// =============================================================================

export function Delete[Entity]Form({
  [entity]Name,
  onConfirm,
  onCancel,
}: {
  [entity]Name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { form, onConfirm: handleConfirm, isLoading } = useDelete[Entity]Form([entity]Name);

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(async () => {
          await handleConfirm();
          onConfirm();
        })} 
        className="space-y-4"
      >
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">
            This action cannot be undone. Please type <strong>{[entity]Name}</strong> to confirm.
          </p>
        </div>

        <FormField
          control={form.control}
          name="confirmName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type "{[entity]Name}" to confirm</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Type the name"
                  autoComplete="off"
                />
              </FormControl>
              {field.value !== [entity]Name && field.value !== '' && (
                <FormMessage>Name does not match</FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button 
            type="submit" 
            variant="destructive"
            disabled={isLoading || form.getValues('confirmName') !== [entity]Name}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * // Create form:
 * import { [Entity]Form } from './[Entity]Form';
 * 
 * <[Entity]Form onSuccess={() => router.push('/[entities]')} />
 * 
 * // Edit form:
 * <[Entity]Form 
 *   initialData={{ id: '123', name: 'Test', ... }}
 *   onSuccess={() => router.back()}
 * />
 * 
 * // Delete confirmation:
 * <Delete[Entity]Form
 *   [entity]Name="My Product"
 *   onConfirm={() => router.push('/[entities]')}
 *   onCancel={() => router.back()}
 * />
 */
