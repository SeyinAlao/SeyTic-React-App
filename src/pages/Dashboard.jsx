import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  TicketIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Plus,
} from "lucide-react";
import { getSession, logout } from "../utils/auth";
import { getTicketStats } from "../utils/tickets";
import { toast } from "sonner";

export default function Dashboard({ onLogout, onNavigateToTickets }) {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });

  // --- Updated useEffect: wait for session and refresh stats properly ---
  useEffect(() => {
    const init = async () => {
      const session = getSession();
      if (session && session.user) {
        setUserName(session.user.name || "User");
        setUserId(session.user.id);
        await refreshStats(session.user.id);
      } else {
        setUserName("Homie");
        await refreshStats();
      }
    };
    init();
  }, []);

  // --- Make refreshStats async and numeric-safe ---
  const refreshStats = async (userId) => {
    try {
      const s = await getTicketStats(userId);
      if (s) {
        setStats({
          total: Number(s.total) || 0,
          open: Number(s.open) || 0,
          inProgress: Number(s.inProgress) || 0,
          closed: Number(s.closed) || 0,
        });
      }
    } catch (err) {
      console.warn("Failed to load ticket stats", err);
    }
  };

  // --- Debug: see updates in console (optional) ---
  useEffect(() => {
    console.log("Stats updated:", stats);
  }, [stats]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    if (typeof onLogout === "function") onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TicketIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-900">SeyTic</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 hidden sm:inline">
                Welcome, {userName}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Monitor your tickets and manage your workflow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<TicketIcon className="w-6 h-6" />}
            label="Total Tickets"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6" />}
            label="Open Tickets"
            value={stats.open}
            color="green"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="In Progress"
            value={stats.inProgress}
            color="amber"
          />
          <StatCard
            icon={<CheckCircle2 className="w-6 h-6" />}
            label="Closed Tickets"
            value={stats.closed}
            color="gray"
          />
        </div>

        {/* Quick Actions */}
        <Card className="p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-slate-900 mb-2">Ticket Management</h2>
              <p className="text-slate-600">
                Create, view, edit, and manage all your tickets in one place
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={onNavigateToTickets} variant="outline">
                View All Tickets
              </Button>
              <Button
                onClick={onNavigateToTickets}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Ticket</span>
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 shadow-lg">
            <h3 className="text-slate-900 mb-3">Recent Activity</h3>
            <p className="text-slate-600 mb-4">
              Stay updated with your latest ticket activities and changes
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={onNavigateToTickets}
            >
              View Activity
            </Button>
          </Card>

          <Card className="p-6 shadow-lg">
            <h3 className="text-slate-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Resolution Rate</span>
                <span className="text-slate-900">
                  {Number(stats.total) > 0 &&
                  Number.isFinite(Number(stats.closed))
                    ? Math.round(
                        (Number(stats.closed || 0) / Number(stats.total)) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Active Tickets</span>
                <span className="text-slate-900">
                  {stats.open + stats.inProgress}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    amber: "bg-amber-100 text-amber-600",
    gray: "bg-slate-100 text-slate-600",
  };

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-600 mb-2">{label}</p>
          <p className="text-slate-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};
