export interface ManagedStudent {
  id: string;
  name: string;
  phone: string;
  cetScore: number;
  branch: string;
  status: "Interested" | "Not Contacted" | "Follow Up";
  createdAt: string;
}

export interface Campaign {
  id: string;
  message: string;
  recipientGroup: string;
  recipientCount: number;
  sentAt: string;
}
