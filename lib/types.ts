export type ApplicationStatus = "applied" | "interviewing" | "offer" | "rejected" | "unresponsive" | "ghosted";
export type OfferCurrency = "₱" | "$";

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  location: string | null;
  url: string | null;
  offer: string | null;
  offer_currency: OfferCurrency;
  status: ApplicationStatus;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationFormData {
  company: string;
  role: string;
  location?: string;
  url?: string;
  offer?: string;
  offer_currency?: OfferCurrency;
  status: ApplicationStatus;
  applied_date: string;
  notes?: string;
}
