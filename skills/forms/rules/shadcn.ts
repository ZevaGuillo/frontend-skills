// Shadcn Integration — LOAD: when using shadcn components
// ~25 lines → ~500 bytes

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// BASIC USAGE
<Form {...form}>
  <FormField name="name" render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl><Input {...field} /></FormControl>
      <FormMessage />
    </FormItem>
  )} />
</Form>

// WITH SELECT
<Select onValueChange={field.onChange} value={field.value}>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">A</SelectItem>
    <SelectItem value="b">B</SelectItem>
  </SelectContent>
</Select>
