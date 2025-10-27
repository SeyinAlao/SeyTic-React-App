import { getTickets, addTicket, updateTicket, deleteTicket } from '../utils/tickets';
import { toast } from 'sonner';
import { useState } from 'react';

export function useTickets(userId) {
  const [tickets, setTickets] = useState([]);

  const loadTickets = () => {
    const all = getTickets(userId);
    setTickets(all);
  };

  const create = (data) => {
    try {
      addTicket(data, userId);
      loadTickets();
      toast.success('Ticket created successfully');
    } catch {
      toast.error('Failed to create ticket');
    }
  };

  const update = (id, data) => {
    try {
      updateTicket(id, data);
      loadTickets();
      toast.success('Ticket updated successfully');
    } catch {
      toast.error('Failed to update ticket');
    }
  };

  const remove = (id) => {
    try {
      const success = deleteTicket(id);
      if (success) {
        loadTickets();
        toast.success('Ticket deleted successfully');
      } else {
        toast.error('Failed to delete ticket');
      }
    } catch {
      toast.error('Failed to delete ticket');
    }
  };

  return { tickets, loadTickets, create, update, remove };
}
