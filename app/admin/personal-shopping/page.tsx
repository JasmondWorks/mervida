"use client";
import { useEffect, useState } from "react";
import {
  initPersonalShoppingStore,
  getDiasporaRequests,
  getElderCareRegistrations,
  saveDiasporaRequest,
  saveElderCareRegistration,
  deleteDiasporaRequest,
  deleteElderCareRegistration,
} from "@/app/lib/personal-shopping-store";
import type {
  DiasporaRequest,
  DiasporaRequestStatus,
  ElderCareRegistration,
  ElderCareStatus,
} from "@/app/lib/personal-shopping-types";
import { ConfirmDialog, Tabs, H1, Text } from "@/app/components/ui";
import { Table, type TableColumn } from "@/app/components/table";

const DIASPORA_STATUSES: DiasporaRequestStatus[] = [
  "new",
  "contacted",
  "quoted",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

const ELDER_STATUSES: ElderCareStatus[] = ["active", "paused", "cancelled"];

function statusColor(status: string) {
  const map: Record<string, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-100",
    contacted: "bg-amber-50 text-amber-700 border-amber-100",
    quoted: "bg-purple-50 text-purple-700 border-purple-100",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    packed: "bg-sky-50 text-sky-700 border-sky-100",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-100",
    delivered: "bg-green-50 text-green-700 border-green-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
    active: "bg-emerald-50 text-emerald-700 border-emerald-100",
    paused: "bg-amber-50 text-amber-700 border-amber-100",
  };
  return map[status] || "bg-slate-50 text-slate-700 border-slate-100";
}

export default function AdminPersonalShoppingPage() {
  const [tab, setTab] = useState<"diaspora" | "elder">("diaspora");
  const [diasporaRequests, setDiasporaRequests] = useState<DiasporaRequest[]>(
    [],
  );
  const [elderRegistrations, setElderRegistrations] = useState<
    ElderCareRegistration[]
  >([]);
  const [selectedRequest, setSelectedRequest] =
    useState<DiasporaRequest | null>(null);
  const [selectedRegistration, setSelectedRegistration] =
    useState<ElderCareRegistration | null>(null);
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "diaspora"; id: string } | { kind: "elder"; id: string } | null
  >(null);

  useEffect(() => {
    initPersonalShoppingStore();
    reload();
  }, []);

  function reload() {
    setDiasporaRequests(getDiasporaRequests());
    setElderRegistrations(getElderCareRegistrations());
  }

  function updateDiasporaStatus(id: string, status: DiasporaRequestStatus) {
    const req = diasporaRequests.find((r) => r.id === id);
    if (!req) return;
    saveDiasporaRequest({ ...req, status });
    reload();
  }

  function updateElderStatus(id: string, status: ElderCareStatus) {
    const reg = elderRegistrations.find((r) => r.id === id);
    if (!reg) return;
    saveElderCareRegistration({ ...reg, status });
    reload();
  }

  function confirmPendingDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "diaspora") {
      deleteDiasporaRequest(pendingDelete.id);
      setSelectedRequest(null);
    } else {
      deleteElderCareRegistration(pendingDelete.id);
      setSelectedRegistration(null);
    }
    setPendingDelete(null);
    reload();
  }

  return (
    <div className="p-8 sm:p-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <H1 className="text-3xl tracking-tighter text-slate-950">Personal Shopping</H1>
        <Text size="xs" tone="subtle">
          Diaspora requests and elder care registrations
        </Text>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <Tabs
          items={[
            { label: "Diaspora Requests", value: "diaspora", count: diasporaRequests.length },
            { label: "Elder Care Registrations", value: "elder", count: elderRegistrations.length },
          ]}
          value={tab}
          onChange={(v) => {
            setTab(v as "diaspora" | "elder");
            setSelectedRequest(null);
            setSelectedRegistration(null);
          }}
        />
      </div>

      {/* Diaspora Tab */}
      {tab === "diaspora" && (
        <div>
          {selectedRequest ? (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back to List
                </button>
                <div className="flex gap-2">
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => {
                      updateDiasporaStatus(
                        selectedRequest.id,
                        e.target.value as DiasporaRequestStatus,
                      );
                      setSelectedRequest({
                        ...selectedRequest,
                        status: e.target.value as DiasporaRequestStatus,
                      });
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold outline-none"
                  >
                    {DIASPORA_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setPendingDelete({ kind: "diaspora", id: selectedRequest.id })}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <DetailRow label="Name" value={selectedRequest.fullName} />
                  <DetailRow label="Email" value={selectedRequest.email} />
                  <DetailRow
                    label="WhatsApp"
                    value={selectedRequest.whatsappNumber}
                  />
                  <DetailRow
                    label="Country"
                    value={selectedRequest.deliveryCountry}
                  />
                  <DetailRow
                    label="Address"
                    value={selectedRequest.deliveryAddress || "—"}
                  />
                  <DetailRow
                    label="Occasion"
                    value={selectedRequest.occasion || "—"}
                  />
                  <DetailRow
                    label="Specific Meal"
                    value={selectedRequest.specificMeal || "—"}
                  />
                  <DetailRow label="Urgency" value={selectedRequest.urgency} />
                  <DetailRow
                    label="Date"
                    value={new Date(
                      selectedRequest.createdAt,
                    ).toLocaleDateString()}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">
                      Shopping List
                    </p>
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedRequest.shoppingList}
                    </div>
                  </div>
                  {selectedRequest.isGift && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">
                        🎁 Gift Order
                      </p>
                      <DetailRow
                        label="Recipient"
                        value={selectedRequest.recipientName}
                      />
                      <DetailRow
                        label="Recipient Address"
                        value={selectedRequest.recipientAddress}
                      />
                      <DetailRow
                        label="Gift Message"
                        value={selectedRequest.giftMessage || "—"}
                      />
                    </div>
                  )}
                  {selectedRequest.additionalNotes && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-1">
                        Additional Notes
                      </p>
                      <div className="bg-white border border-slate-100 rounded-2xl p-4 text-sm text-slate-700">
                        {selectedRequest.additionalNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <Table
                data={diasporaRequests}
                emptyMessage="No diaspora requests yet."
                columns={
                  [
                    {
                      key: "createdAt",
                      label: "Date",
                      className: "text-xs font-normal text-slate-500 whitespace-nowrap",
                      render: (req) => new Date(req.createdAt).toLocaleDateString(),
                    },
                    {
                      key: "fullName",
                      label: "Name",
                      className: "text-xs font-semibold text-slate-900",
                    },
                    {
                      key: "deliveryCountry",
                      label: "Country",
                      className: "text-xs font-normal text-slate-500",
                    },
                    {
                      key: "shoppingList",
                      label: "Shopping List",
                      className: "text-xs font-normal text-slate-500 max-w-50 truncate",
                    },
                    {
                      key: "urgency",
                      label: "Urgency",
                      className: "text-xs font-normal text-slate-500",
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (req) => (
                        <select
                          value={req.status}
                          onChange={(e) => updateDiasporaStatus(req.id, e.target.value as DiasporaRequestStatus)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border outline-none ${statusColor(req.status)}`}
                        >
                          {DIASPORA_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      ),
                    },
                  ] as TableColumn<DiasporaRequest>[]
                }
                actions={[{ label: "View", onClick: setSelectedRequest, className: "text-emerald-600" }]}
              />
            </>
          )}
        </div>
      )}

      {/* Elder Care Tab */}
      {tab === "elder" && (
        <div>
          {selectedRegistration ? (
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back to List
                </button>
                <div className="flex gap-2">
                  <select
                    value={selectedRegistration.status}
                    onChange={(e) => {
                      updateElderStatus(
                        selectedRegistration.id,
                        e.target.value as ElderCareStatus,
                      );
                      setSelectedRegistration({
                        ...selectedRegistration,
                        status: e.target.value as ElderCareStatus,
                      });
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-xs font-bold outline-none"
                  >
                    {ELDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setPendingDelete({ kind: "elder", id: selectedRegistration.id })}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-3">
                      Guardian Information
                    </p>
                    <div className="space-y-3">
                      <DetailRow
                        label="Name"
                        value={selectedRegistration.guardianName}
                      />
                      <DetailRow
                        label="Relationship"
                        value={selectedRegistration.relationship}
                      />
                      <DetailRow
                        label="Phone"
                        value={selectedRegistration.guardianPhone}
                      />
                      <DetailRow
                        label="Email"
                        value={selectedRegistration.guardianEmail}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-3">
                      Elderly Person
                    </p>
                    <div className="space-y-3">
                      <DetailRow
                        label="Name"
                        value={selectedRegistration.elderlyName}
                      />
                      <DetailRow
                        label="Phone"
                        value={selectedRegistration.elderlyPhone || "—"}
                      />
                      <DetailRow
                        label="Address"
                        value={selectedRegistration.elderlyAddress}
                      />
                      <DetailRow
                        label="Age Range"
                        value={selectedRegistration.ageRange || "—"}
                      />
                      <DetailRow
                        label="Mobility Notes"
                        value={selectedRegistration.mobilityNotes || "—"}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-3">
                      Preferences
                    </p>
                    <div className="space-y-3">
                      <DetailRow
                        label="Frequency"
                        value={selectedRegistration.shoppingFrequency}
                      />
                      <DetailRow
                        label="Delivery Days"
                        value={
                          selectedRegistration.preferredDeliveryDays.join(
                            ", ",
                          ) || "—"
                        }
                      />
                      <DetailRow
                        label="Delivery Time"
                        value={
                          selectedRegistration.preferredDeliveryTime || "—"
                        }
                      />
                      <DetailRow
                        label="Payment"
                        value={
                          selectedRegistration.paymentContact === "family"
                            ? "Family (remote)"
                            : "Elderly (cash on delivery)"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Table
                data={elderRegistrations}
                emptyMessage="No elder care registrations yet."
                columns={
                  [
                    {
                      key: "createdAt",
                      label: "Date",
                      className: "text-xs font-normal text-slate-500 whitespace-nowrap",
                      render: (reg) => new Date(reg.createdAt).toLocaleDateString(),
                    },
                    {
                      key: "elderlyName",
                      label: "Elderly Person",
                      className: "text-xs font-semibold text-slate-900",
                    },
                    {
                      key: "guardianName",
                      label: "Guardian",
                      className: "text-xs font-normal text-slate-500",
                    },
                    {
                      key: "elderlyAddress",
                      label: "Address",
                      className: "text-xs font-normal text-slate-500 max-w-50 truncate",
                    },
                    {
                      key: "shoppingFrequency",
                      label: "Frequency",
                      className: "text-xs font-normal text-slate-500",
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: (reg) => (
                        <select
                          value={reg.status}
                          onChange={(e) => updateElderStatus(reg.id, e.target.value as ElderCareStatus)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border outline-none ${statusColor(reg.status)}`}
                        >
                          {ELDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      ),
                    },
                  ] as TableColumn<ElderCareRegistration>[]
                }
                actions={[{ label: "View", onClick: setSelectedRegistration, className: "text-emerald-600" }]}
              />
            </>
          )}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmPendingDelete}
        title={pendingDelete?.kind === "diaspora" ? "Delete request?" : "Delete registration?"}
        message="This record will be permanently removed. This can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 min-w-[100px] pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-700 font-medium">{value}</span>
    </div>
  );
}
