"use client";
import { useEffect, useState } from "react";
import { initStore } from "@/app/lib/store";
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

  useEffect(() => {
    initStore();
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

  function handleDeleteDiaspora(id: string) {
    if (!confirm("Delete this request?")) return;
    deleteDiasporaRequest(id);
    setSelectedRequest(null);
    reload();
  }

  function updateElderStatus(id: string, status: ElderCareStatus) {
    const reg = elderRegistrations.find((r) => r.id === id);
    if (!reg) return;
    saveElderCareRegistration({ ...reg, status });
    reload();
  }

  function handleDeleteElder(id: string) {
    if (!confirm("Delete this registration?")) return;
    deleteElderCareRegistration(id);
    setSelectedRegistration(null);
    reload();
  }

  return (
    <div className="p-8 sm:p-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-2">
          Personal Shopping
        </p>
        <h1 className="text-3xl font-display font-bold tracking-tighter text-slate-950">
          Requests & Registrations
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => {
            setTab("diaspora");
            setSelectedRequest(null);
            setSelectedRegistration(null);
          }}
          className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
            tab === "diaspora"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          Diaspora Requests
          {diasporaRequests.length > 0 && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-[9px]">
              {diasporaRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setTab("elder");
            setSelectedRequest(null);
            setSelectedRegistration(null);
          }}
          className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
            tab === "elder"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          Elder Care Registrations
          {elderRegistrations.length > 0 && (
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-[9px]">
              {elderRegistrations.length}
            </span>
          )}
        </button>
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
                    className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold outline-none"
                  >
                    {DIASPORA_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDeleteDiaspora(selectedRequest.id)}
                    className="px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
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
              {diasporaRequests.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-16 text-center">
                  <p className="text-slate-400 font-bold text-sm">
                    No diaspora requests yet.
                  </p>
                  <p className="text-slate-300 text-xs mt-2">
                    Requests submitted from the diaspora shopping page will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Date
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Name
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Country
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Shopping List
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Urgency
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Status
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {diasporaRequests.map((req) => (
                          <tr
                            key={req.id}
                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                              {req.fullName}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {req.deliveryCountry}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs max-w-[200px] truncate">
                              {req.shoppingList}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {req.urgency}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={req.status}
                                onChange={(e) =>
                                  updateDiasporaStatus(
                                    req.id,
                                    e.target.value as DiasporaRequestStatus,
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border outline-none ${statusColor(req.status)}`}
                              >
                                {DIASPORA_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedRequest(req)}
                                className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
                    className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-bold outline-none"
                  >
                    {ELDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDeleteElder(selectedRegistration.id)}
                    className="px-4 py-2 rounded-full bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
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
              {elderRegistrations.length === 0 ? (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-16 text-center">
                  <p className="text-slate-400 font-bold text-sm">
                    No elder care registrations yet.
                  </p>
                  <p className="text-slate-300 text-xs mt-2">
                    Registrations from the elder care shopping page will appear
                    here.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Date
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Elderly Person
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Guardian
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Address
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Frequency
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Status
                          </th>
                          <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {elderRegistrations.map((reg) => (
                          <tr
                            key={reg.id}
                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                              {new Date(reg.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 text-xs">
                              {reg.elderlyName}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {reg.guardianName}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs max-w-[200px] truncate">
                              {reg.elderlyAddress}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-xs">
                              {reg.shoppingFrequency}
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={reg.status}
                                onChange={(e) =>
                                  updateElderStatus(
                                    reg.id,
                                    e.target.value as ElderCareStatus,
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border outline-none ${statusColor(reg.status)}`}
                              >
                                {ELDER_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedRegistration(reg)}
                                className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
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
