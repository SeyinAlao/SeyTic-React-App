import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TicketIcon, LogOut, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { getSession, logout } from "../utils/auth";
import { getTickets, addTicket, updateTicket, deleteTicket, getTicketStats } from "../utils/tickets";
import { toast } from "sonner";

export default function TicketManagement({ onLogout, onBack }) {
  const [tickets, setTickets] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
  });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });

  useEffect(() => {
    loadTickets();
    refreshStats();
   
    const session = getSession();
    if (!session) {
    }
  }, []);

  function loadTickets() {
    try {
      const all = getTickets() || [];
      setTickets(all);
    } catch (err) {
      console.warn("Failed to load tickets", err);
      setTickets([]);
    }
  }

  function refreshStats() {
    try {
      const s = getTicketStats();
      if (s) setStats(s);
    } catch (err) {
      console.warn("Failed to refresh stats", err);
    }
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    if (typeof onLogout === "function") onLogout();
  };

  
  const handleCreateTicket = (data) => {
    try {
      const created = addTicket(data);
      loadTickets();
      refreshStats();
      setIsCreateDialogOpen(false);
      toast.success("Ticket created successfully");
      return created;
    } catch (error) {
      toast.error("Failed to create ticket");
      console.error(error);
    }
  };

  
  const openEditDialog = (ticket) => {
    if (!ticket) return;
    setSelectedTicket(ticket);
    setFormData({
      title: ticket.title || "",
      description: ticket.description || "",
      status: ticket.status || "open",
      priority: ticket.priority || "medium",
    });
    setIsEditDialogOpen(true);
  };


  const handleEditTicket = (data) => {
    if (!selectedTicket) return toast.error("No ticket selected");
    try {
      updateTicket(selectedTicket.id, data);
      loadTickets();
      refreshStats();
      setIsEditDialogOpen(false);
      setSelectedTicket(null);
      toast.success("Ticket updated successfully");
    } catch (err) {
      toast.error("Failed to update ticket");
    }
  };

  
  const openDeleteDialog = (ticket) => {
    setSelectedTicket(ticket || null);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTicket = () => {
    if (!selectedTicket) {
      toast.error("No ticket selected");
      return;
    }
    try {
      deleteTicket(selectedTicket.id);
      loadTickets();
      refreshStats();
      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
      toast.success("Ticket deleted successfully");
    } catch (err) {
      toast.error("Failed to delete ticket");
    }
  };

  const openCreateDialog = () => {
    setFormData({ title: "", description: "", status: "open", priority: "medium" });
    setSelectedTicket(null);
    setIsCreateDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.status) {
      toast.error("Title and status are required");
      return;
    }
    handleCreateTicket({
      ...formData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.status) {
      toast.error("Title and status are required");
      return;
    }
    handleEditTicket({
      ...formData,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TicketIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-900">SeyTic</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => (typeof onBack === "function" ? onBack() : null)}>
                <ArrowLeft className="w-4 h-4 " />
                Dashboard
              </Button>
              <Button variant="outline" className="flex items-center gap-2" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-slate-900 mb-2">Ticket Management</h1>
            <p className="text-slate-600">Create, view, edit, and manage all your tickets</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </div>
        </div>

        
        {tickets.length === 0 ? (
          <Card className="p-12 text-center shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TicketIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-slate-900 mb-2 items-center ">No tickets yet</h3>
              <p className="text-slate-600 mb-6 items-center">Get started by creating your first ticket</p>
              <Button onClick={openCreateDialog} className="flex items-center gap-2">
                <Plus className="w-4 h-4 mr-2" />
                Create First Ticket
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard key={ticket?.id} ticket={ticket} onEdit={() => openEditDialog(ticket)} onDelete={() => openDeleteDialog(ticket)} />
            ))}
          </div>
        )}
      </main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px] bg-white text-black rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>Fill in the details to create a new ticket</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleFormChange("description", e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleFormChange("status", v)}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => handleFormChange("priority", v)}>
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
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Ticket
              </Button>

            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px] bg-white text-black rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>Update the ticket details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleFormChange("description", e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
  <Label htmlFor="status">Status</Label>
  <Select
    value={formData.status}
    onValueChange={(v) => handleFormChange("status", v)}
  >
        <SelectTrigger
          id="status"
           className="bg-white border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

            <SelectContent className="bg-white border border-gray-300 text-gray-800 shadow-md rounded-md"position="popper">
             <SelectItem value="open">Open</SelectItem>
             <SelectItem value="in_progress">In Progress</SelectItem>
             <SelectItem value="closed">Closed</SelectItem>
             </SelectContent>
            </Select>
          </div>

            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white text-black rounded-lg shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the ticket "{selectedTicket?.title || ""}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTicket} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* TicketCard component (safe: uses optional chaining) */
const TicketCard = ({ ticket, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "in_progress":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "closed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (!ticket) return null;

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <Badge className={getStatusColor(ticket.status)}>{(ticket.status || "").replace("_", " ")}</Badge>
        {ticket.priority && <Badge variant="outline" className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>}
      </div>

      <h3 className="text-slate-900 mb-2 line-clamp-2">{ticket.title}</h3>
      {ticket.description && <p className="text-slate-600 mb-4 line-clamp-3">{ticket.description}</p>}

      <div className="flex items-center justify-between text-slate-500 mb-4 pt-4 border-t border-slate-200">
        <span>Created {formatDate(ticket.createdAt)}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit && onEdit(ticket)} className="flex-1">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete && onDelete(ticket)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
