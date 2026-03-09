export type DiasporaRequestStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type ElderCareStatus = "active" | "paused" | "cancelled";

export interface DiasporaRequest {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
  deliveryCountry: string;
  deliveryAddress: string;
  shoppingList: string;
  occasion: string;
  specificMeal: string;
  urgency: string;
  additionalNotes: string;
  isGift: boolean;
  recipientName: string;
  recipientAddress: string;
  giftMessage: string;
  status: DiasporaRequestStatus;
  adminNotes: string;
  createdAt: string;
}

export interface ElderCareRegistration {
  id: string;
  // Guardian info
  guardianName: string;
  relationship: string;
  guardianPhone: string;
  guardianEmail: string;
  // Elderly person info
  elderlyName: string;
  elderlyPhone: string;
  elderlyAddress: string;
  ageRange: string;
  mobilityNotes: string;
  // Service preferences
  shoppingFrequency: string;
  preferredDeliveryDays: string[];
  preferredDeliveryTime: string;
  paymentContact: string;
  additionalNotes: string;
  // Admin
  status: ElderCareStatus;
  nextDelivery: string;
  adminNotes: string;
  createdAt: string;
}
