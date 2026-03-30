/**
 * Form Fields Template
 * 
 * Reusable form field components using shadcn/ui
 * Keep in: forms/components/FormFields.tsx
 * 
 * Replace: [Entity] → Product, User, Order
 */

'use client';

import * as React from 'react';
import { UseFormRegister, FieldErrors, Control, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { cn } from '@/lib/utils';

// =============================================================================
// Import shadcn components
// =============================================================================

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';

// =============================================================================
// Text Field
// =============================================================================

interface TextFieldProps<T> {
  name: keyof T;
  label: string;
  description?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  control: Control<T>;
  errors?: FieldErrors<T>;
  register?: UseFormRegister<T>;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}

export function TextField<T>({
  name,
  label,
  description,
  placeholder,
  type = 'text',
  control,
  errors,
  disabled,
  required,
  maxLength,
}: TextFieldProps<T>) {
  const error = errors?.[name]?.message as string;

  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              value={field.value ?? ''}
              onChange={e => {
                const value = type === 'number' ? Number(e.target.value) : e.target.value;
                field.onChange(value);
              }}
              className={cn(error && 'border-destructive')}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

// =============================================================================
// Textarea Field
// =============================================================================

interface TextareaFieldProps<T> {
  name: keyof T;
  label: string;
  description?: string;
  placeholder?: string;
  control: Control<T>;
  errors?: FieldErrors<T>;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}

export function TextareaField<T>({
  name,
  label,
  description,
  placeholder,
  control,
  errors,
  rows = 4,
  disabled,
  required,
  maxLength,
}: TextareaFieldProps<T>) {
  const error = errors?.[name]?.message as string;

  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              maxLength={maxLength}
              value={field.value ?? ''}
              className={cn(error && 'border-destructive', !field.value && 'text-muted-foreground')}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

// =============================================================================
// Select Field
// =============================================================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T> {
  name: keyof T;
  label: string;
  description?: string;
  placeholder?: string;
  options: SelectOption[];
  control: Control<T>;
  errors?: FieldErrors<T>;
  disabled?: boolean;
  required?: boolean;
}

export function SelectField<T>({
  name,
  label,
  description,
  placeholder,
  options,
  control,
  errors,
  disabled,
  required,
}: SelectFieldProps<T>) {
  const error = errors?.[name]?.message as string;

  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value as string}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn(error && 'border-destructive')}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

// =============================================================================
// Checkbox Field
// =============================================================================

interface CheckboxFieldProps<T> {
  name: keyof T;
  label: string;
  description?: string;
  control: Control<T>;
  errors?: FieldErrors<T>;
  disabled?: boolean;
}

export function CheckboxField<T>({
  name,
  label,
  description,
  control,
  errors,
  disabled,
}: CheckboxFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  );
}

// =============================================================================
// Radio Group Field
// =============================================================================

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupFieldProps<T> {
  name: keyof T;
  label: string;
  description?: string;
  options: RadioOption[];
  control: Control<T>;
  errors?: FieldErrors<T>;
  disabled?: boolean;
  required?: boolean;
}

export function RadioGroupFieldProps<T>({
  name,
  label,
  description,
  options,
  control,
  errors,
  disabled,
  required,
}: RadioGroupFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name as string}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value as string}
              disabled={disabled}
              className="flex flex-col space-y-1"
            >
              {options.map(option => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {errors?.[name] && <FormMessage>{errors[name]?.message as string}</FormMessage>}
        </FormItem>
      )}
    />
  );
}

// =============================================================================
// Conditional Field
// =============================================================================

interface ConditionalFieldProps<T> {
  condition: boolean;
  children: React.ReactNode;
}

export function ConditionalField<T>({ condition, children }: ConditionalFieldProps<T>) {
  if (!condition) return null;
  return <>{children}</>;
}

// =============================================================================
// Usage Examples
// =============================================================================

/**
 * // Basic usage with form:
 * const form = useForm<CreateProductFormData>({ ... });
 * const { control, formState: { errors } } = form;
 * 
 * <TextField
 *   name="name"
 *   label="Product Name"
 *   placeholder="Enter product name"
 *   control={control}
 *   errors={errors}
 *   required
 * />
 * 
 * <TextareaField
 *   name="description"
 *   label="Description"
 *   control={control}
 *   errors={errors}
 *   rows={4}
 * />
 * 
 * <SelectField
 *   name="category"
 *   label="Category"
 *   placeholder="Select category"
 *   options={[
 *     { value: 'electronics', label: 'Electronics' },
 *     { value: 'clothing', label: 'Clothing' },
 *   ]}
 *   control={control}
 *   errors={errors}
 *   required
 * />
 * 
 * <CheckboxField
 *   name="isActive"
 *   label="Active product"
 *   description="Inactive products won't show in catalog"
 *   control={control}
 *   errors={errors}
 * />
 * 
 * // Conditional field:
 * const paymentMethod = form.watch('paymentMethod');
 * 
 * <ConditionalField condition={paymentMethod === 'credit_card'}>
 *   <TextField
 *     name="cardNumber"
 *     label="Card Number"
 *     control={control}
 *     errors={errors}
 *   />
 * </ConditionalField>
 */
