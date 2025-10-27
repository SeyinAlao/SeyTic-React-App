export const getTickets = () => {
  const tickets = localStorage.getItem("tickets");
  return tickets ? JSON.parse(tickets) : [];
};


export const addTicket = (newTicket) => {
  const tickets = getTickets();
  const ticketWithId = {
    id: Date.now(),
    ...newTicket,
    status: newTicket.status || "open", 
  };
  tickets.push(ticketWithId);
  localStorage.setItem("tickets", JSON.stringify(tickets));
  return ticketWithId;
};


export const updateTicket = (id, updatedFields) => {
  const tickets = getTickets();
  const updatedTickets = tickets.map((ticket) =>
    ticket.id === id ? { ...ticket, ...updatedFields } : ticket
  );
  localStorage.setItem("tickets", JSON.stringify(updatedTickets));
  return updatedTickets;
};


export const deleteTicket = (id) => {
  const tickets = getTickets().filter((ticket) => ticket.id !== id);
  localStorage.setItem("tickets", JSON.stringify(tickets));
  return tickets;
};


export const getTicketStats = () => {
  const tickets = getTickets();

  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter(
    (t) => t.status === "in_progress"
  ).length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  return { total, open, inProgress, closed };
};


