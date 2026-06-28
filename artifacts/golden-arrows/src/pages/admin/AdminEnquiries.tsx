import { useState } from "react";
import { format } from "date-fns";
import { Mail, Trash2, CheckCheck, Eye, Clock } from "lucide-react";
import { useListEnquiries, useUpdateEnquiry, useDeleteEnquiry } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";

type Status = "unread" | "read" | "resolved";

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  unread: { label: "Unread", color: "bg-primary/20 text-primary border border-primary/30" },
  read: { label: "Read", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
  resolved: { label: "Resolved", color: "bg-green-500/20 text-green-400 border border-green-500/30" },
};

export default function AdminEnquiries() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<null | ReturnType<typeof useListEnquiries>["data"]>(null);

  const { data: enquiries, isLoading } = useListEnquiries(
    filter === "all" ? {} : { status: filter }
  );

  const updateMutation = useUpdateEnquiry();
  const deleteMutation = useDeleteEnquiry();

  function handleStatusChange(id: number, status: Status) {
    updateMutation.mutate(
      { id, data: { status } },
      { onSuccess: () => qc.invalidateQueries({ queryKey: ["listEnquiries"] }) }
    );
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this enquiry?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: ["listEnquiries"] });
          if ((selected as any)?.[0]?.id === id) setSelected(null);
        },
      }
    );
  }

  const unreadCount = enquiries?.filter(e => e.status === "unread").length ?? 0;

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl uppercase tracking-tight flex items-center gap-3">
            Enquiries
            {unreadCount > 0 && (
              <span className="text-base bg-primary text-black font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Messages submitted via the Contact Us form.</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "unread", "read", "resolved"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              filter === f
                ? "bg-primary text-black"
                : "bg-card border border-white/10 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List panel */}
        <div className="lg:col-span-2 space-y-2">
          {isLoading && (
            <div className="text-muted-foreground text-sm py-8 text-center">Loading…</div>
          )}
          {!isLoading && enquiries?.length === 0 && (
            <div className="bg-card border border-white/5 rounded-xl p-8 text-center">
              <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No enquiries yet.</p>
            </div>
          )}
          {enquiries?.map(enq => (
            <button
              key={enq.id}
              onClick={() => {
                setSelected([enq] as any);
                if (enq.status === "unread") handleStatusChange(enq.id, "read");
              }}
              className={`w-full text-left bg-card border rounded-xl p-4 transition-colors hover:border-primary/40 ${
                (selected as any)?.[0]?.id === enq.id
                  ? "border-primary/50 bg-primary/5"
                  : enq.status === "unread"
                  ? "border-primary/20"
                  : "border-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[enq.status as Status].color}`}>
                  {STATUS_CONFIG[enq.status as Status].label}
                </span>
                <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(enq.createdAt), "MMM d, HH:mm")}
                </span>
              </div>
              <p className={`font-bold text-sm truncate mb-0.5 ${enq.status === "unread" ? "text-white" : "text-white/80"}`}>
                {enq.firstName} {enq.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">{enq.subject}</p>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-3">
          {!(selected as any)?.[0] ? (
            <div className="bg-card border border-white/5 rounded-xl p-8 text-center h-64 flex flex-col items-center justify-center">
              <Mail className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Select an enquiry to read it</p>
            </div>
          ) : (
            (() => {
              const enq = (selected as any)[0];
              return (
                <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-display font-bold text-xl uppercase tracking-tight">{enq.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          From <span className="text-foreground font-medium">{enq.firstName} {enq.lastName}</span>
                          {" · "}
                          <a href={`mailto:${enq.email}`} className="text-primary hover:underline">{enq.email}</a>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(enq.createdAt), "EEEE, MMMM d yyyy 'at' HH:mm")}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${STATUS_CONFIG[enq.status as Status].color}`}>
                        {STATUS_CONFIG[enq.status as Status].label}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      {enq.status !== "resolved" && (
                        <button
                          onClick={() => handleStatusChange(enq.id, "resolved")}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600/30 text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-600/30 transition-colors"
                        >
                          <CheckCheck className="h-3.5 w-3.5" /> Mark Resolved
                        </button>
                      )}
                      {enq.status === "resolved" && (
                        <button
                          onClick={() => handleStatusChange(enq.id, "unread")}
                          className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/30 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" /> Reopen
                        </button>
                      )}
                      <a
                        href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject)}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-600/30 text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-600/30 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5" /> Reply by Email
                      </a>
                      <button
                        onClick={() => handleDelete(enq.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/30 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-600/30 transition-colors ml-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="p-6">
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Message</p>
                    <div className="bg-background border border-white/5 rounded-lg p-5 text-sm leading-relaxed whitespace-pre-wrap">
                      {enq.message}
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
