// Error Handling — LOAD: when handling server errors
// ~15 lines → ~300 bytes

// SERVER ERRORS → FORM ERRORS
const onSubmit = form.handleSubmit(async (data) => {
  try {
    await mutation.mutateAsync(data);
  } catch (error) {
    if (error.response?.status === 409) {
      form.setError('name', { message: 'Already exists' });
    } else if (error.response?.status === 422) {
      // Map server errors to fields
      Object.entries(error.response.data.errors).forEach(([field, msg]) => {
        form.setError(field as keyof FormData, { message: msg });
      });
    }
  }
});

// FIELD ERROR DISPLAY
{form.formState.touchedFields.name && form.formState.errors.name && (
  <p>{form.formState.errors.name.message}</p>
)}
