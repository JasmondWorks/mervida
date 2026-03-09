import type {
  DiasporaRequest,
  ElderCareRegistration,
} from "./personal-shopping-types";

const KEYS = {
  diasporaRequests: "gfo_diaspora_requests",
  elderCareRegistrations: "gfo_elder_care_registrations",
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function initPersonalShoppingStore(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEYS.diasporaRequests))
    write(KEYS.diasporaRequests, []);
  if (!localStorage.getItem(KEYS.elderCareRegistrations))
    write(KEYS.elderCareRegistrations, []);
}

// ── Diaspora Requests ─────────────────────────────────────────────────────────

export function getDiasporaRequests(): DiasporaRequest[] {
  return read<DiasporaRequest[]>(KEYS.diasporaRequests) ?? [];
}

export function getDiasporaRequest(id: string): DiasporaRequest | undefined {
  return getDiasporaRequests().find((r) => r.id === id);
}

export function saveDiasporaRequest(request: DiasporaRequest): void {
  const list = getDiasporaRequests();
  const idx = list.findIndex((r) => r.id === request.id);
  if (idx >= 0) list[idx] = request;
  else list.unshift(request);
  write(KEYS.diasporaRequests, list);
}

export function deleteDiasporaRequest(id: string): void {
  write(
    KEYS.diasporaRequests,
    getDiasporaRequests().filter((r) => r.id !== id),
  );
}

// ── Elder Care Registrations ──────────────────────────────────────────────────

export function getElderCareRegistrations(): ElderCareRegistration[] {
  return read<ElderCareRegistration[]>(KEYS.elderCareRegistrations) ?? [];
}

export function getElderCareRegistration(
  id: string,
): ElderCareRegistration | undefined {
  return getElderCareRegistrations().find((r) => r.id === id);
}

export function saveElderCareRegistration(
  registration: ElderCareRegistration,
): void {
  const list = getElderCareRegistrations();
  const idx = list.findIndex((r) => r.id === registration.id);
  if (idx >= 0) list[idx] = registration;
  else list.unshift(registration);
  write(KEYS.elderCareRegistrations, list);
}

export function deleteElderCareRegistration(id: string): void {
  write(
    KEYS.elderCareRegistrations,
    getElderCareRegistrations().filter((r) => r.id !== id),
  );
}
