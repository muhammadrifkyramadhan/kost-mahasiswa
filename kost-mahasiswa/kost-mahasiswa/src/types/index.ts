export type UserRole = 'user' | 'admin' | 'superadmin' | 'developer';

export type KostType = 'putra' | 'putri' | 'campur';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: string;
  pricePerMonth: number;
  size: string; // e.g. "3x4 m"
  isAvailable: boolean;
  currentTenantId?: string;
  facilities: string[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  userCampus: string;
  roomNumber: string;
  isVerifiedTenant: boolean;
  rating: number; // 1 to 5
  cleanliness: number;
  security: number;
  facilities: number;
  location: number;
  comment: string;
  date: string;
  photos?: string[];
  ownerResponse?: {
    date: string;
    comment: string;
  };
}

export interface KostListing {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  type: KostType;
  campusNearby: string; // e.g., "Universitas Indonesia (500m)"
  campusKey: 'UI' | 'ITB' | 'UGM' | 'UNDIP' | 'ITS' | 'UNAIR' | 'UB';
  distanceToCampus: string; // e.g. "500 meter"
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  pricePerMonth: number;
  discountPerYearPercent?: number;
  images: string[];
  facilities: string[];
  rules: string[];
  rating: number;
  reviewCount: number;
  totalRooms: number;
  availableRooms: number;
  rooms: Room[];
  ownerName: string;
  ownerPhone: string;
  ownerAvatar: string;
  isSuperhost?: boolean;
  isVerifiedByPlatform: boolean;
  reviews: Review[];
}

export type PaymentMethod = 
  | 'qris' 
  | 'bca_va' 
  | 'mandiri_va' 
  | 'bri_va' 
  | 'bni_va' 
  | 'gopay' 
  | 'ovo' 
  | 'dana' 
  | 'manual_transfer';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'disputed' | 'refunded';

export interface Booking {
  id: string;
  bookingCode: string;
  kostId: string;
  kostName: string;
  kostImage: string;
  roomNumber: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  tenantCampus: string;
  startDate: string; // ISO date
  durationMonths: number;
  endDate: string;
  monthlyRent: number;
  depositFee: number;
  serviceFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  nextPaymentDue: string;
  invoiceUrl?: string;
}

export type TicketCategory = 'listrik' | 'plumbing' | 'wifi' | 'kebersihan' | 'fasilitas' | 'keamanan';
export type TicketStatus = 'diajukan' | 'diproses' | 'teknisi_dikirim' | 'selesai';
export type TicketPriority = 'normal' | 'mendesak' | 'darurat';

export interface MaintenanceTicket {
  id: string;
  ticketCode: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  kostId: string;
  kostName: string;
  category: TicketCategory;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  photoUrl?: string;
  technicianNote?: string;
  estimatedFixDate?: string;
  timeline: {
    time: string;
    status: TicketStatus;
    note: string;
  }[];
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface CommunityChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRoom: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  tag?: 'pengumuman' | 'kiriman_paket' | 'tanya' | 'umum';
}

export interface AppNotification {
  id: string;
  type: 'booking' | 'payment_due' | 'maintenance' | 'chat' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkAction?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  campus?: string;
  major?: string;
  studentId?: string; // NIM
  emergencyContact?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'whatsapp' | 'sms' | 'authenticator';
  registeredAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  detail: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface SystemHealthMetric {
  serverStatus: 'Optimal' | 'Degraded' | 'Down';
  uptimeSeconds: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  activeDbConnections: number;
  maxDbConnections: number;
  queryLatencyMs: number;
  redisCacheHitRate: number; // percentage
  requestsPerMinute: number;
}
