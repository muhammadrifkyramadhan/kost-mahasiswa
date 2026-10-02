import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  KostListing,
  UserProfile,
  UserRole,
  Booking,
  MaintenanceTicket,
  AppNotification,
  AuditLog,
  SystemHealthMetric,
  CommunityChatMessage,
  DirectMessage,
  PaymentMethod,
  PaymentStatus,
  TicketStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_KOST_LISTINGS,
  INITIAL_BOOKINGS,
  INITIAL_TICKETS,
  INITIAL_COMMUNITY_MESSAGES,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DEV_METRICS
} from '../data/mockData';

interface AppContextType {
  // Authentication & Role
  currentUser: UserProfile;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  login: (identifier: string, isPhone: boolean, pass: string) => { requires2FA: boolean; tempUser: UserProfile };
  register: (data: { name: string; email: string; phone: string; campus?: string; major?: string; studentId?: string; role?: UserRole }) => { requires2FA: boolean; tempUser: UserProfile };
  directLoginAsRole: (role: UserRole) => void;
  verify2FA: (code: string) => boolean;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  twoFactorModalOpen: boolean;
  setTwoFactorModalOpen: (open: boolean) => void;
  tempAuthUser: UserProfile | null;

  // Kost listings
  kosts: KostListing[];
  selectedKost: KostListing | null;
  setSelectedKost: (kost: KostListing | null) => void;
  addKost: (newKost: Partial<KostListing>) => void;
  updateKost: (id: string, updates: Partial<KostListing>) => void;
  deleteKost: (id: string) => void;
  updateRoomAvailability: (kostId: string, roomId: string, isAvailable: boolean) => void;

  // Bookings & Payments
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'paymentStatus'>) => Booking;
  processPayment: (bookingId: string, method: PaymentMethod, simulatedSuccess?: boolean) => void;
  activeBookingModalKost: KostListing | null;
  setActiveBookingModalKost: (kost: KostListing | null) => void;
  activePaymentBooking: Booking | null;
  setActivePaymentBooking: (booking: Booking | null) => void;

  // Maintenance Tickets
  tickets: MaintenanceTicket[];
  createTicket: (data: Omit<MaintenanceTicket, 'id' | 'ticketCode' | 'createdAt' | 'status' | 'timeline'>) => void;
  updateTicketStatus: (ticketId: string, newStatus: TicketStatus, technicianNote?: string) => void;

  // Chat
  communityMessages: CommunityChatMessage[];
  directMessages: DirectMessage[];
  sendCommunityMessage: (text: string, tag?: 'pengumuman' | 'kiriman_paket' | 'tanya' | 'umum') => void;
  sendDirectMessage: (text: string) => void;
  chatDrawerOpen: boolean;
  setChatDrawerOpen: (open: boolean) => void;
  chatTab: 'direct' | 'community';
  setChatTab: (tab: 'direct' | 'community') => void;

  // Real-time Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  activeToast: AppNotification | null;
  dismissToast: () => void;

  // System & Developer
  auditLogs: AuditLog[];
  devMetrics: SystemHealthMetric;
  refreshDevMetrics: () => void;
  clearCache: () => void;
  optimizeDatabase: () => void;

  // Active View Tab for navigation
  activeTab: 'browse' | 'map' | 'tenant-tickets' | 'admin-dashboard' | 'superadmin-dashboard' | 'dev-dashboard' | 'profile';
  setActiveTab: (tab: 'browse' | 'map' | 'tenant-tickets' | 'admin-dashboard' | 'superadmin-dashboard' | 'dev-dashboard' | 'profile') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kost_mahasiswa_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication gate starts logged out by default
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('kost_user_logged_in') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = sessionStorage.getItem('kost_user_role') as UserRole;
    return saved && INITIAL_USERS[saved] ? saved : 'user';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = sessionStorage.getItem('kost_user_role') as UserRole;
    return saved && INITIAL_USERS[saved] ? INITIAL_USERS[saved] : INITIAL_USERS.user;
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState<boolean>(false);
  const [tempAuthUser, setTempAuthUser] = useState<UserProfile | null>(null);

  const [kosts, setKosts] = useState<KostListing[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_kosts`);
    return saved ? JSON.parse(saved) : INITIAL_KOST_LISTINGS;
  });

  const [selectedKost, setSelectedKost] = useState<KostListing | null>(null);
  const [activeBookingModalKost, setActiveBookingModalKost] = useState<KostListing | null>(null);
  const [activePaymentBooking, setActivePaymentBooking] = useState<Booking | null>(null);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tickets`);
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [communityMessages, setCommunityMessages] = useState<CommunityChatMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_community`);
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_MESSAGES;
  });

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_direct`);
    return saved ? JSON.parse(saved) : INITIAL_DIRECT_MESSAGES;
  });

  const [chatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);
  const [chatTab, setChatTab] = useState<'direct' | 'community'>('direct');

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'payment_due',
      title: 'Pengingat Jatuh Tempo Sewa Kos',
      message: 'Sewa Kamar 101 akan jatuh tempo dalam 3 hari lagi. Klik untuk bayar via QRIS/VA.',
      timestamp: 'Baru saja',
      isRead: false,
      linkAction: 'profile'
    },
    {
      id: 'notif-2',
      type: 'maintenance',
      title: 'Update Teknisi: Perbaikan Lampu Kamar Mandi',
      message: 'Pak Joko (Teknisi) dijadwalkan tiba pkl 14:00 WIB untuk penggantian bohlam LED.',
      timestamp: '1 jam lalu',
      isRead: false,
      linkAction: 'tenant-tickets'
    },
    {
      id: 'notif-3',
      type: 'booking',
      title: 'Booking Kamar Disetujui',
      message: 'Booking Anda di Kost Cendekia Margonda telah aktif dengan kuitansi digital terbit.',
      timestamp: 'Kemarin',
      isRead: true,
      linkAction: 'profile'
    }
  ]);

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [devMetrics, setDevMetrics] = useState<SystemHealthMetric>(INITIAL_DEV_METRICS);
  const [activeTab, setActiveTab] = useState<'browse' | 'map' | 'tenant-tickets' | 'admin-dashboard' | 'superadmin-dashboard' | 'dev-dashboard' | 'profile'>('browse');

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_kosts`, JSON.stringify(kosts));
  }, [kosts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tickets`, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_community`, JSON.stringify(communityMessages));
  }, [communityMessages]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_direct`, JSON.stringify(directMessages));
  }, [directMessages]);

  // Toast trigger helper with auto-dismiss
  const showToast = (notif: AppNotification) => {
    setActiveToast(notif);
    setTimeout(() => {
      setActiveToast((prev) => (prev?.id === notif.id ? null : prev));
    }, 6000);
  };

  const addNotification = (data: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      timestamp: 'Baru saja',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(newNotif);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const dismissToast = () => setActiveToast(null);

  // Switch role seamlessly
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(INITIAL_USERS[role] || INITIAL_USERS.user);
    
    // Auto route appropriately
    if (role === 'admin') setActiveTab('admin-dashboard');
    else if (role === 'superadmin') setActiveTab('superadmin-dashboard');
    else if (role === 'developer') setActiveTab('dev-dashboard');
    else setActiveTab('browse');

    addNotification({
      type: 'system',
      title: `Mode Berganti: ${role.toUpperCase()}`,
      message: `Anda sekarang bertindak dengan hak akses ${role}. Semua fitur role ini aktif.`,
    });
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  const register = (data: { name: string; email: string; phone: string; campus?: string; major?: string; studentId?: string; role?: UserRole }) => {
    const assignedRole = data.role || 'user';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatar: assignedRole === 'admin' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: assignedRole,
      campus: data.campus || 'Universitas Indonesia (UI Depok)',
      major: data.major || 'Teknik Informatika',
      studentId: data.studentId || `${Math.floor(2100000000 + Math.random() * 90000000)}`,
      emergencyContact: '081234567890 (Wali)',
      twoFactorEnabled: true,
      twoFactorMethod: 'whatsapp',
      registeredAt: new Date().toISOString().substring(0, 10),
    };
    setTempAuthUser(newUser);
    setTwoFactorModalOpen(true);
    return { requires2FA: true, tempUser: newUser };
  };

  const directLoginAsRole = (role: UserRole) => {
    const user = INITIAL_USERS[role] || INITIAL_USERS.user;
    setCurrentUser(user);
    setCurrentRole(role);
    setIsLoggedIn(true);
    sessionStorage.setItem('kost_user_logged_in', 'true');
    sessionStorage.setItem('kost_user_role', role);

    if (role === 'admin') setActiveTab('admin-dashboard');
    else if (role === 'superadmin') setActiveTab('superadmin-dashboard');
    else if (role === 'developer') setActiveTab('dev-dashboard');
    else setActiveTab('browse');

    addNotification({
      type: 'system',
      title: `Selamat Datang, ${user.name}`,
      message: `Login berhasil sebagai ${role.toUpperCase()}. Anda memiliki akses penuh sesuai hak akses.`,
    });
  };

  const login = (identifier: string, isPhone: boolean, pass: string) => {
    // Determine which user matches or pick standard student
    let matchedUser = INITIAL_USERS.user;
    if (identifier.includes('endang') || identifier.includes('owner') || identifier.includes('081122334455')) {
      matchedUser = INITIAL_USERS.admin;
    } else if (identifier.includes('bima') || identifier.includes('ops') || identifier.includes('081809008811')) {
      matchedUser = INITIAL_USERS.superadmin;
    } else if (identifier.includes('kevin') || identifier.includes('dev') || identifier.includes('081977665544')) {
      matchedUser = INITIAL_USERS.developer;
    }

    setTempAuthUser(matchedUser);

    if (matchedUser.twoFactorEnabled) {
      setTwoFactorModalOpen(true);
      return { requires2FA: true, tempUser: matchedUser };
    } else {
      setCurrentUser(matchedUser);
      setCurrentRole(matchedUser.role);
      setIsLoggedIn(true);
      sessionStorage.setItem('kost_user_logged_in', 'true');
      sessionStorage.setItem('kost_user_role', matchedUser.role);
      setAuthModalOpen(false);
      return { requires2FA: false, tempUser: matchedUser };
    }
  };

  const verify2FA = (code: string) => {
    // Support demo OTP code "123456" or any 6-digit code for convenience
    if (code.trim().length === 6 && tempAuthUser) {
      setCurrentUser(tempAuthUser);
      setCurrentRole(tempAuthUser.role);
      setIsLoggedIn(true);
      sessionStorage.setItem('kost_user_logged_in', 'true');
      sessionStorage.setItem('kost_user_role', tempAuthUser.role);
      setTwoFactorModalOpen(false);
      setAuthModalOpen(false);

      if (tempAuthUser.role === 'admin') setActiveTab('admin-dashboard');
      else if (tempAuthUser.role === 'superadmin') setActiveTab('superadmin-dashboard');
      else if (tempAuthUser.role === 'developer') setActiveTab('dev-dashboard');
      else setActiveTab('browse');

      // Log 2FA success audit log
      const log: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: tempAuthUser.email,
        role: tempAuthUser.role,
        action: 'AUTH_2FA_VERIFIED',
        detail: `Verifikasi 2FA berhasil via ${tempAuthUser.twoFactorMethod || 'WhatsApp'}`,
        ipAddress: '180.252.164.21 (Depok, ID)',
        status: 'SUCCESS',
      };
      setAuditLogs((prev) => [log, ...prev]);

      addNotification({
        type: 'system',
        title: 'Verifikasi 2FA Berhasil',
        message: `Selamat datang kembali, ${tempAuthUser.name}! Autentikasi dua faktor terverifikasi aman.`,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('kost_user_logged_in');
    sessionStorage.removeItem('kost_user_role');
    setIsLoggedIn(false);
    addNotification({
      type: 'system',
      title: 'Sesi Berakhir',
      message: 'Anda telah keluar dari akun dengan aman.',
    });
  };

  // Kost Management
  const addKost = (newKostData: Partial<KostListing>) => {
    const id = `kost-${Date.now()}`;
    const newKost: KostListing = {
      id,
      name: newKostData.name || 'Kost Baru Mahasiswa',
      slug: (newKostData.name || 'kost-baru').toLowerCase().replace(/\s+/g, '-'),
      tagline: newKostData.tagline || 'Hunian nyaman mahasiswa',
      description: newKostData.description || 'Deskripsi kos',
      type: newKostData.type || 'campur',
      campusNearby: newKostData.campusNearby || 'Dekat Kampus Utama',
      campusKey: newKostData.campusKey || 'UI',
      distanceToCampus: newKostData.distanceToCampus || '500m',
      address: newKostData.address || 'Alamat kos',
      city: newKostData.city || 'Depok',
      latitude: newKostData.latitude || -6.3687,
      longitude: newKostData.longitude || 106.8332,
      pricePerMonth: newKostData.pricePerMonth || 1500000,
      images: newKostData.images?.length ? newKostData.images : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80'],
      facilities: newKostData.facilities || ['AC Dingin', 'Kamar Mandi Dalam', 'WiFi 50 Mbps'],
      rules: newKostData.rules || ['Bebas jam malam', 'Jaga ketertiban'],
      rating: 5.0,
      reviewCount: 0,
      totalRooms: newKostData.totalRooms || 10,
      availableRooms: newKostData.availableRooms || 10,
      rooms: newKostData.rooms || [
        { id: `r-${Date.now()}-1`, number: '101', floor: 1, type: 'Standard', pricePerMonth: 1500000, size: '3x4 m', isAvailable: true, facilities: ['AC', 'KM Dalam'] },
        { id: `r-${Date.now()}-2`, number: '102', floor: 1, type: 'Standard', pricePerMonth: 1500000, size: '3x4 m', isAvailable: true, facilities: ['AC', 'KM Dalam'] },
      ],
      ownerName: currentUser.name,
      ownerPhone: currentUser.phone,
      ownerAvatar: currentUser.avatar,
      isVerifiedByPlatform: true,
      reviews: [],
    };
    setKosts((prev) => [newKost, ...prev]);

    addNotification({
      type: 'system',
      title: 'Kos Baru Ditambahkan',
      message: `${newKost.name} telah berhasil dipublikasikan ke dalam sistem.`,
    });
  };

  const updateKost = (id: string, updates: Partial<KostListing>) => {
    setKosts((prev) => prev.map((k) => (k.id === id ? { ...k, ...updates } : k)));
  };

  const deleteKost = (id: string) => {
    setKosts((prev) => prev.filter((k) => k.id !== id));
    addNotification({
      type: 'system',
      title: 'Listing Dihapus',
      message: 'Data kos telah dihapus dari sistem pengelola.',
    });
  };

  const updateRoomAvailability = (kostId: string, roomId: string, isAvailable: boolean) => {
    setKosts((prev) =>
      prev.map((k) => {
        if (k.id !== kostId) return k;
        const updatedRooms = k.rooms.map((r) => (r.id === roomId ? { ...r, isAvailable } : r));
        const availableCount = updatedRooms.filter((r) => r.isAvailable).length;
        return {
          ...k,
          rooms: updatedRooms,
          availableRooms: availableCount,
        };
      })
    );
  };

  // Booking & Payment
  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'paymentStatus'>) => {
    const bookingId = `bkg-${Date.now()}`;
    const code = `KM-${bookingData.tenantCampus.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      bookingCode: code,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      paymentStatus: 'pending',
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Mark room unavailable in kost
    updateRoomAvailability(bookingData.kostId, bookingData.roomNumber, false);

    addNotification({
      type: 'booking',
      title: 'Pemesanan Kamar Dibuat',
      message: `Pemesanan ${newBooking.kostName} No. Kamar ${newBooking.roomNumber} berhasil dibuat. Silakan selesaikan pembayaran.`,
      linkAction: 'profile',
    });

    return newBooking;
  };

  const processPayment = (bookingId: string, method: PaymentMethod, simulatedSuccess: boolean = true) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const newStatus: PaymentStatus = simulatedSuccess ? 'paid' : 'failed';
        return {
          ...b,
          paymentMethod: method,
          paymentStatus: newStatus,
          paidAt: simulatedSuccess ? new Date().toISOString().replace('T', ' ').substring(0, 19) : undefined,
        };
      })
    );

    if (simulatedSuccess) {
      addNotification({
        type: 'booking',
        title: 'Pembayaran Digital Dikonfirmasi Real-Time! 🎉',
        message: `Transaksi pembayaran sewa berhasil diverifikasi. Kuitansi digital resmi telah diterbitkan.`,
        linkAction: 'profile',
      });

      // Log in audit log
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          user: currentUser.email,
          role: currentUser.role,
          action: 'PAYMENT_SETTLED',
          detail: `Pembayaran sewa ${bookingId} via ${method.toUpperCase()} lunas terverifikasi`,
          ipAddress: '180.252.164.21 (Depok, ID)',
          status: 'SUCCESS',
        },
        ...prev,
      ]);
    }
  };

  // Maintenance tickets
  const createTicket = (data: Omit<MaintenanceTicket, 'id' | 'ticketCode' | 'createdAt' | 'status' | 'timeline'>) => {
    const ticketId = `tkt-${Date.now()}`;
    const code = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTicket: MaintenanceTicket = {
      ...data,
      id: ticketId,
      ticketCode: code,
      createdAt: now,
      status: 'diajukan',
      timeline: [{ time: now, status: 'diajukan', note: `Tiket kendala diajukan oleh ${data.tenantName}` }],
    };

    setTickets((prev) => [newTicket, ...prev]);

    addNotification({
      type: 'maintenance',
      title: 'Laporan Kendala Terkirim',
      message: `Tiket #${code} (${data.title}) berhasil dikirim ke pengelola kos.`,
      linkAction: 'tenant-tickets',
    });
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus, technicianNote?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        const statusLabels: Record<TicketStatus, string> = {
          diajukan: 'Laporan diajukan',
          diproses: 'Sedang ditinjau pengelola',
          teknisi_dikirim: 'Teknisi ditugaskan ke lokasi',
          selesai: 'Perbaikan telah selesai'
        };
        const updatedTimeline = [
          ...t.timeline,
          {
            time: now,
            status: newStatus,
            note: technicianNote || statusLabels[newStatus],
          },
        ];
        return {
          ...t,
          status: newStatus,
          technicianNote: technicianNote || t.technicianNote,
          timeline: updatedTimeline,
        };
      })
    );

    addNotification({
      type: 'maintenance',
      title: `Status Perbaikan #${ticketId.substring(0, 8)} Diperbarui`,
      message: `Status kendala kini: ${newStatus.replace('_', ' ').toUpperCase()}. ${technicianNote ? `Catatan: ${technicianNote}` : ''}`,
      linkAction: 'tenant-tickets',
    });
  };

  // Chat
  const sendCommunityMessage = (text: string, tag: 'pengumuman' | 'kiriman_paket' | 'tanya' | 'umum' = 'umum') => {
    const msg: CommunityChatMessage = {
      id: `cmsg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (${currentUser.role === 'admin' ? 'Pengelola' : 'Penyewa'})`,
      senderRoom: currentUser.role === 'admin' ? 'Kantor' : 'Kamar 101',
      senderAvatar: currentUser.avatar,
      text,
      timestamp: 'Baru saja',
      tag,
    };
    setCommunityMessages((prev) => [...prev, msg]);
  };

  const sendDirectMessage = (text: string) => {
    const userRole = currentUser.role === 'admin' ? 'admin' : 'user';
    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: userRole,
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setDirectMessages((prev) => [...prev, newMsg]);

    // Simulate auto reply from owner if sent by user
    if (userRole === 'user') {
      setTimeout(() => {
        const autoReply: DirectMessage = {
          id: `dm-reply-${Date.now()}`,
          senderId: 'adm-owner-01',
          senderName: 'Hj. Endang Suryaningsih (Owner Kost)',
          senderRole: 'admin',
          text: 'Halo Mas Dimas, pesan sudah saya terima ya. Tim kami segera cek ke lokasi / bantu keluhan Anda. Terima kasih!',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };
        setDirectMessages((prev) => [...prev, autoReply]);
        addNotification({
          type: 'chat',
          title: 'Pesan Baru dari Pemilik Kos',
          message: 'Hj. Endang membalas: Halo Mas Dimas, pesan sudah saya terima ya...',
        });
      }, 1500);
    }
  };

  // Developer actions
  const refreshDevMetrics = () => {
    setDevMetrics((prev) => ({
      ...prev,
      cpuUsagePercent: Number((12 + Math.random() * 15).toFixed(1)),
      memoryUsagePercent: Number((38 + Math.random() * 8).toFixed(1)),
      queryLatencyMs: Number((10 + Math.random() * 8).toFixed(1)),
      redisCacheHitRate: Number((93 + Math.random() * 5).toFixed(1)),
      requestsPerMinute: Math.floor(750 + Math.random() * 250),
    }));
  };

  const clearCache = () => {
    setDevMetrics((prev) => ({
      ...prev,
      redisCacheHitRate: 99.4,
      queryLatencyMs: 8.4,
    }));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.email,
        role: currentUser.role,
        action: 'REDIS_CACHE_PURGE',
        detail: 'In-memory Redis cache purged successfully across all edge clusters',
        ipAddress: '10.0.1.5 (DevOps Bastion)',
        status: 'SUCCESS',
      },
      ...prev,
    ]);
    addNotification({
      type: 'system',
      title: 'Cache Redis Dibersihkan',
      message: 'Seluruh cluster cache berhasil di-flush. Performa kembali segar.',
    });
  };

  const optimizeDatabase = () => {
    setDevMetrics((prev) => ({
      ...prev,
      queryLatencyMs: 6.2,
      activeDbConnections: 18,
    }));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: currentUser.email,
        role: currentUser.role,
        action: 'DB_ANALYZE_VACUUM',
        detail: 'PostgreSQL VACUUM FULL & REINDEX executed on kost_listings & bookings tables',
        ipAddress: '10.0.2.14 (Master DB)',
        status: 'SUCCESS',
      },
      ...prev,
    ]);
    addNotification({
      type: 'system',
      title: 'Database Teroptimasi',
      message: 'Query planner dan indeks basis data berhasil dioptimalkan. Latency turun ke 6.2ms.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        updateCurrentUser,
        isLoggedIn,
        login,
        register,
        directLoginAsRole,
        verify2FA,
        logout,
        authModalOpen,
        setAuthModalOpen,
        twoFactorModalOpen,
        setTwoFactorModalOpen,
        tempAuthUser,

        kosts,
        selectedKost,
        setSelectedKost,
        addKost,
        updateKost,
        deleteKost,
        updateRoomAvailability,

        bookings,
        createBooking,
        processPayment,
        activeBookingModalKost,
        setActiveBookingModalKost,
        activePaymentBooking,
        setActivePaymentBooking,

        tickets,
        createTicket,
        updateTicketStatus,

        communityMessages,
        directMessages,
        sendCommunityMessage,
        sendDirectMessage,
        chatDrawerOpen,
        setChatDrawerOpen,
        chatTab,
        setChatTab,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        activeToast,
        dismissToast,

        auditLogs,
        devMetrics,
        refreshDevMetrics,
        clearCache,
        optimizeDatabase,

        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
