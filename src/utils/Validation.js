export function validateTicketForm(formData) {
  const errors = {};

  if (!formData.title.trim()) errors.title = 'Title is required';
  else if (formData.title.length > 200) errors.title = 'Title must be less than 200 characters';

  if (!['open', 'in_progress', 'closed'].includes(formData.status))
    errors.status = 'Invalid status';

  if (formData.description && formData.description.length > 1000)
    errors.description = 'Description too long';

  return errors;
};
