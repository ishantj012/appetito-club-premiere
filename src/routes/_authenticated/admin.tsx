import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listReservations,
  updateReservationStatus,
  updateReservationNotes,
  deleteReservation,
  checkAdmin,
} from "@/lib/reservations.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Reservations Admin — Appetito Club" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  occasion: string | null;
  special_requests: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  admin_notes: string | null;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  confirmed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-400/30",
  completed: "bg-sky-500/15 text-sky-300 border-sky-400/30",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const checkAdminFn = useServerFn(checkAdmin);
  const listFn = useServerFn(listReservations);
  const updateStatusFn = useServerFn(updateReservationStatus);
  const updateNotesFn = useServerFn(updateReservationNotes);
  const deleteFn = useServerFn(deleteReservation);

  const [status, setStatus] = useState<"" | (typeof STATUSES)[number]>("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [notesFor, setNotesFor] = useState<Reservation | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const roleQ = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => checkAdminFn(),
  });

  const filters = useMemo(
    () => ({
      status: status || undefined,
      search: search.trim() || undefined,
      from: from || undefined,
      to: to || undefined,
    }),
    [status, search, from, to],
  );

  const q = useQuery({
    queryKey: ["reservations", filters],
    queryFn: () => listFn({ data: filters }) as Promise<Reservation[]>,
    enabled: roleQ.data?.isAdmin === true,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["reservations"] });

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: Reservation["status"] }) => updateStatusFn({ data: v }),
    onSuccess: () => {
      toast.success("Status updated");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const notesMut = useMutation({
    mutationFn: (v: { id: string; admin_notes: string | null }) => updateNotesFn({ data: v }),
    onSuccess: () => {
      toast.success("Notes saved");
      setNotesFor(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Reservation deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (roleQ.isLoading) {
    return <div className="min-h-screen grid place-items-center text-foreground/60">Loading…</div>;
  }
  if (!roleQ.data?.isAdmin) {
    return (
      <main className="min-h-screen grid place-items-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">Unauthorized</h1>
          <p className="mt-3 text-foreground/70 text-sm">
            Your account is signed in, but you don't have admin access to this dashboard.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={signOut} className="btn-outline-gold rounded-full px-5 py-2 text-xs uppercase tracking-widest">
              Sign out
            </button>
            <Link to="/" className="btn-gold rounded-full px-5 py-2 text-xs uppercase tracking-widest">
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const rows = q.data ?? [];

  return (
    <main className="min-h-screen bg-matte px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="text-xs uppercase tracking-[0.3em] text-foreground/50">
              Appetito Club
            </Link>
            <h1 className="font-display text-3xl md:text-4xl mt-1">
              Reservations <span className="text-gold-gradient italic">Admin</span>
            </h1>
          </div>
          <button
            onClick={signOut}
            className="btn-outline-gold rounded-full px-5 py-2 text-xs uppercase tracking-widest"
          >
            Sign out
          </button>
        </header>

        <div className="glass rounded-2xl p-5 mb-6 grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-foreground/50">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input mt-1">
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-foreground/50">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="name, email, phone"
              className="input mt-1"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-foreground/50">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input mt-1" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-foreground/50">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input mt-1" />
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] uppercase tracking-widest text-foreground/50 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Date / Time</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Party</th>
                  <th className="px-4 py-3">Occasion</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {q.isLoading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-foreground/60">
                      Loading…
                    </td>
                  </tr>
                )}
                {!q.isLoading && rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-foreground/60">
                      No reservations match these filters.
                    </td>
                  </tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{r.reservation_date}</div>
                      <div className="text-xs text-foreground/60">{r.reservation_time?.slice(0, 5)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.name}</div>
                      {r.special_requests && (
                        <div className="text-xs text-foreground/60 max-w-[240px] truncate" title={r.special_requests}>
                          {r.special_requests}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{r.email}</div>
                      <div className="text-foreground/60">{r.phone}</div>
                    </td>
                    <td className="px-4 py-3">{r.party_size}</td>
                    <td className="px-4 py-3 text-xs text-foreground/70">{r.occasion || "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          statusMut.mutate({ id: r.id, status: e.target.value as Reservation["status"] })
                        }
                        className={`text-xs rounded-full border px-3 py-1 bg-transparent ${statusColor[r.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-matte text-foreground">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setNotesFor(r);
                            setNotesDraft(r.admin_notes ?? "");
                          }}
                          className="text-xs px-3 py-1 rounded-full border border-white/15 hover:border-gold hover:text-gold transition"
                        >
                          {r.admin_notes ? "Edit notes" : "Add notes"}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete reservation for ${r.name}?`)) deleteMut.mutate(r.id);
                          }}
                          className="text-xs px-3 py-1 rounded-full border border-rose-400/30 text-rose-300 hover:bg-rose-500/10 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {notesFor && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center px-4"
          onClick={() => setNotesFor(null)}
        >
          <div className="glass rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl mb-1">Internal notes</h3>
            <p className="text-xs text-foreground/60 mb-4">
              {notesFor.name} · {notesFor.reservation_date} {notesFor.reservation_time?.slice(0, 5)}
            </p>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows={6}
              maxLength={2000}
              placeholder="Only visible to admins"
              className="input w-full resize-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setNotesFor(null)}
                className="text-xs px-4 py-2 rounded-full border border-white/15"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  notesMut.mutate({ id: notesFor.id, admin_notes: notesDraft.trim() ? notesDraft.trim() : null })
                }
                className="btn-gold text-xs px-4 py-2 rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
