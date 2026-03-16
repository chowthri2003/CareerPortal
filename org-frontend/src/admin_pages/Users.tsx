import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader2, Plus, Shield, Mail } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("hr");
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users");
      const userData = Array.isArray(res.data.data) ? res.data.data : [];
      setUsers(userData);
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  const handleUpdate = async (id: string, payload: { role?: string; isActive?: boolean }) => {
    try {
      await axiosInstance.patch(`/users/${id}`, payload);
      toast.success("User updated successfully");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleCreateUser = async () => {
    if (!newEmail) return toast.error("Email is required");

    try {
      setCreating(true);
      await axiosInstance.post("/users", { email: newEmail, role: newRole });
      toast.success("User added successfully");
      setShowModal(false);
      setNewEmail("");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div 
        className="flex flex-col justify-center items-center h-96 gap-4 transition-colors duration-500"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Loader2 className="animate-spin" size={48} style={{ color: "var(--color-accent)" }} />
        <p className="font-medium animate-pulse" style={{ color: "var(--color-text)", opacity: 0.6 }}>
          Fetching users data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--color-text)" }}>
            User Management
          </h1>
          <p className="text-sm mt-1 font-medium opacity-70" style={{ color: "var(--color-text)" }}>
            Manage permissions and account status
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div 
            className="hidden md:flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-bold border"
            style={{ 
              backgroundColor: "var(--color-primary)", 
              color: "var(--color-accent)",
              borderColor: "var(--color-primaryBorder)"
            }}
          >
            Total Members: {users.length}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            <Plus size={18} /> Add Member
          </button>
        </div>
      </div>
      <div 
        className="rounded-2xl border shadow-sm overflow-hidden transition-all duration-500"
        style={{ 
          backgroundColor: "var(--color-primary)", 
          borderColor: "var(--color-primaryBorder)" 
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="border-b transition-colors"
                style={{
                    backgroundColor: "var(--color-primaryLight)", 
                  borderColor: "var(--color-primaryBorder)"  
                }}
              >
                <th className="p-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50" style={{ color: "var(--color-text)" }}>Member</th>
                <th className="p-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50 text-center" style={{ color: "var(--color-text)" }}>Role</th>
                <th className="p-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50 text-center" style={{ color: "var(--color-text)" }}>Status</th>
                <th className="p-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-50 text-right" style={{ color: "var(--color-text)" }}>Control</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-primaryBorder)" }}>
              
              {users.map((user: any) => (
                <tr key={user.id} className="hover:opacity-80 transition-opacity">
                  <td className="p-6 py-8">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold border"
                        style={{ 
                          backgroundColor: "var(--color-primaryLight)", 
                          color: "var(--color-accent)",
                          borderColor: "var(--color-primaryBorder)"
                        }}
                      >
                        {user.email ? user.email[0].toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: "var(--color-text)" }}>{user.email || "No Email"}</p>
                        <p className="text-[10px] font-mono opacity-50" style={{ color: "var(--color-text)" }}>
                          UID: {user.id?.toString().slice(-8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdate(user.id, { role: e.target.value })}
                      className="text-xs font-bold px-4 py-2 rounded-xl border outline-none transition-colors"
                      style={{ 
                        backgroundColor: "var(--color-background)", 
                        borderColor: "var(--color-primaryBorder)",
                        color: "var(--color-text)"
                      }}
                    >
                      <option value="admin">Admin</option>
                      <option value="hr">HR</option>
                    </select>
                  </td>
                  <td className="p-6 text-center">
                    <span 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight"
                      style={{ 
                        backgroundColor: user.isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
                        color: user.isActive ? "#10b981" : "#f43f5e"
                      }}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => handleUpdate(user.id, { isActive: !user.isActive })}
                      className="text-xs font-bold hover:underline"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <div className="p-20 text-center font-medium italic opacity-40" style={{ color: "var(--color-text)" }}>
              No users found.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div 
            className="rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border scale-in-center transition-all duration-500"
            style={{ 
              backgroundColor: "var(--color-primary)", 
              borderColor: "var(--color-primaryBorder)" 
            }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black" style={{ color: "var(--color-text)" }}>New Member</h2>
              <p className="text-sm font-medium opacity-60" style={{ color: "var(--color-text)" }}>
                Invite a new administrator to the team
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: "var(--color-text)" }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} style={{ color: "var(--color-text)" }} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full border rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none transition-all"
                    style={{ 
                      backgroundColor: "var(--color-background)", 
                      borderColor: "var(--color-primaryBorder)",
                      color: "var(--color-text)"
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-50" style={{ color: "var(--color-text)" }}>
                  Assigned Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} style={{ color: "var(--color-text)" }} />
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none transition-all appearance-none cursor-pointer"
                    style={{ 
                      backgroundColor: "var(--color-background)", 
                      borderColor: "var(--color-primaryBorder)",
                      color: "var(--color-text)"
                    }}
                  >
                    <option value="hr">HR Manager</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-4 text-sm font-bold rounded-2xl transition-colors opacity-60 hover:opacity-100 hover:bg-black/5"
                style={{ color: "var(--color-text)" }}
              >
                Discard
              </button>
              <button
                onClick={handleCreateUser}
                disabled={creating}
                className="flex-1 text-white px-4 py-4 text-sm font-bold rounded-2xl shadow-lg disabled:opacity-50 transition-all active:scale-95"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                {creating ? "Saving..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}