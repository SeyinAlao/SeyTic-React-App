import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { validateTicketForm } from '../utils/Validation';

export const TicketFormDialog = ({ open, onOpenChange, onSubmit, initialData, title, description }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'open',
    priority: initialData?.priority || 'medium'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'open',
        priority: initialData?.priority || 'medium'
      });
      setErrors({});
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTicketForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error('Please fix form errors');
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-600">*</span>
              </Label>
              <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
              {errors.title && <p className="text-red-600">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
              {errors.description && <p className="text-red-600">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="status">
                Status <span className="text-red-600">*</span>
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-600">{errors.status}</p>}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{initialData ? 'Update Ticket' : 'Create Ticket'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
