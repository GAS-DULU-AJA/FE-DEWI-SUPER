# ISSUE-002: Fitur Lengkap Admin DeWi — Management & Monitoring Platform

## Ringkasan

Spesifikasi fitur utama **Admin DeWi** — admin panel terpusat untuk mengelola seluruh ekosistem platform Desa Wisata (desa-wisata) dan Mitra DeWi (mitra-dewi). Admin panel ini berfungsi sebagai **super-admin / back-office** yang mengontrol user, role, approval, transaksi, multi-desa, dan pengaturan platform.

---

## Daftar Fitur

| # | Fitur | Prioritas | Halaman Utama |
|---|-------|-----------|---------------|
| 1 | CRUD Data User | 🔴 High | `/users` |
| 2 | Manajemen Role & Permission | 🔴 High | `/roles` |
| 3 | Dashboard Statistik | 🔴 High | `/dashboard` |
| 4 | Manajemen Approval Pengelola Desa | 🔴 High | `/approvals` |
| 5 | Otentikasi & Otorisasi (JWT/OAuth) | 🔴 High | `/login`, middleware |
| 6 | Pengaturan Web (TnC, Privacy, dll) | 🟡 Medium | `/settings/content` |
| 7 | Audit Log & Monitoring Aktivitas | 🟡 Medium | `/audit-logs` |
| 8 | Monitor Transaksi | 🔴 High | `/transactions` |
| 9 | Manajemen Multi Desa | 🔴 High | `/villages` |
| 10 | Pengaturan Aplikasi | 🟡 Medium | `/settings/app` |

---

## Fitur 1: CRUD Data User

### Deskripsi
Mengelola seluruh data user yang terdaftar di platform, termasuk user dari **mitra-dewi** (partner roles) dan **desa-wisata** (end-user/visitor).

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| User List | `/users` | Tabel user dengan filter, search, pagination |
| User Detail | `/users/[id]` | Detail lengkap + activity log user |
| Create User | `/users/create` | Form tambah user manual |
| Edit User | `/users/[id]/edit` | Edit profil, role, status |

### Data Model

```typescript
interface AdminUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: AdminRole;             // role di platform
  partnerRole?: PartnerRole;   // referensi: 'VILLAGE_ADMIN' | 'ACCOMMODATION' | 'UMKM' | 'EVENT_ORGANIZER'
  villageId?: string;          // relasi ke desa (jika partner)
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  isApproved: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Fitur Detail
- [x] Tabel dengan kolom: Nama, Email, Role, Status, Desa, Terakhir Login, Aksi
- [x] Filter berdasarkan: role, status, desa, tanggal registrasi
- [x] Search by nama / email
- [x] Pagination server-side (10 / 25 / 50 per halaman)
- [x] Bulk action: activate, deactivate, suspend
- [x] Export CSV / Excel
- [x] Soft delete (status → `inactive`, bukan hapus permanen)
- [x] Activity history per user (login, update profil, transaksi)

### Referensi Mitra-Dewi
- `PartnerRole`: `VILLAGE_ADMIN | ACCOMMODATION | UMKM | EVENT_ORGANIZER`
- Demo users: `admin@desawisata.id`, `hotel@dewi.id`, `umkm@dewi.id`, `event@dewi.id`
- Auth store di mitra-dewi: Zustand + persist middleware → admin-dewi harus sinkron via API

---

## Fitur 2: Manajemen Role & Permission

### Deskripsi
Mengatur role admin dan mapping permission (RBAC) untuk mengontrol akses ke setiap fitur admin panel.

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Role List | `/roles` | Daftar semua role + jumlah user per role |
| Role Detail | `/roles/[id]` | Detail permission matrix |
| Create/Edit Role | `/roles/[id]/edit` | Form konfigurasi permission |

### Data Model

```typescript
type AdminRole = 'super_admin' | 'admin' | 'finance_admin' | 'support' | 'viewer';

interface Role {
  id: string;
  name: string;
  slug: AdminRole;
  description: string;
  permissions: Permission[];
  userCount: number;
  isSystem: boolean;         // role bawaan (tidak bisa dihapus)
  createdAt: string;
}

interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

type PermissionModule =
  | 'users'
  | 'roles'
  | 'villages'
  | 'approvals'
  | 'transactions'
  | 'audit_logs'
  | 'settings'
  | 'dashboard'
  | 'content';

type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'export' | 'approve';
```

### Default Role Matrix

| Permission | super_admin | admin | finance_admin | support | viewer |
|-----------|:-----------:|:-----:|:-------------:|:-------:|:------:|
| users.* | ✅ | ✅ | ❌ | view | view |
| roles.* | ✅ | ❌ | ❌ | ❌ | ❌ |
| villages.* | ✅ | ✅ | view | view | view |
| approvals.* | ✅ | ✅ | ❌ | view | view |
| transactions.* | ✅ | view | ✅ | view | view |
| audit_logs.view | ✅ | ✅ | ✅ | ✅ | ❌ |
| settings.* | ✅ | ❌ | ❌ | ❌ | ❌ |
| dashboard.view | ✅ | ✅ | ✅ | ✅ | ✅ |
| content.* | ✅ | ✅ | ❌ | ❌ | ❌ |

### Fitur Detail
- [x] Permission matrix UI (checkbox grid per module × action)
- [x] Role bawaan sistem tidak bisa dihapus (super_admin, admin)
- [x] Custom role creation
- [x] Assign/unassign role ke user
- [x] Guard: middleware check permission sebelum akses halaman
- [x] Hook `usePermission(module, action)` untuk conditional render

---

## Fitur 3: Dashboard Statistik

### Deskripsi
Dashboard utama menampilkan KPI, grafik, dan ringkasan data dari seluruh platform.

### Route: `/dashboard`

### KPI Cards

| KPI | Sumber Data | Icon |
|-----|-------------|------|
| Total User Terdaftar | users count | `Users` |
| User Aktif (30 hari) | user login activity | `UserCheck` |
| Total Desa Terdaftar | villages count | `MapPin` |
| Desa Aktif | villages with active partners | `Globe` |
| Total Partner | partners count per role | `Building2` |
| Pending Approvals | approval queue count | `Clock` |
| Total Transaksi (bulan ini) | transactions sum | `CreditCard` |
| Revenue Platform (bulan ini) | platform fee total | `TrendingUp` |

### Grafik & Chart

```typescript
interface DashboardCharts {
  userGrowth: TimeSeriesData[];            // Line chart: registrasi user per minggu/bulan
  transactionVolume: TimeSeriesData[];     // Bar chart: volume transaksi per hari/minggu
  revenueByType: PieChartData[];           // Pie chart: revenue per tipe (accommodation, sme, experience, facility)
  partnerDistribution: PieChartData[];     // Donut chart: partner per role
  villagePerformance: RankingData[];       // Horizontal bar: top 10 desa by revenue
  approvalFunnel: FunnelData[];            // Funnel: pending → review → approved
}
```

### Fitur Detail
- [x] Date range picker (hari ini, 7 hari, 30 hari, custom range)
- [x] Filter per desa
- [x] Quick links ke pending approvals & recent transactions
- [x] Real-time update (polling / SSE)
- [x] Responsive grid: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)
- [x] Chart library: **Recharts** (lightweight, React-native)

### Referensi Mitra-Dewi
- `VillageDashboardKpi`: totalPartners, pendingApprovals, activeExperiences, monthlyRevenue, facilityUtilizationRate
- Revenue sharing splits: accommodation 85/15, sme 90/10, experience 85/15 atau 60/25/15

---

## Fitur 4: Manajemen Approval Pengelola Desa

### Deskripsi
Workflow approval untuk partner yang mendaftar di mitra-dewi. Admin memverifikasi dan approve/reject partner applications.

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Approval Queue | `/approvals` | Daftar semua pending approval dengan tabs |
| Approval Detail | `/approvals/[id]` | Detail lengkap + checklist + aksi |
| Approval History | `/approvals/history` | Riwayat approval yang sudah diproses |

### Data Model

```typescript
interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  applicant: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  villageId?: string;
  villageName?: string;
  partnerRole: PartnerRole;  // VILLAGE_ADMIN | ACCOMMODATION | UMKM | EVENT_ORGANIZER
  status: ApprovalStatus;
  completionScore: number;   // 0-100, kelengkapan dokumen
  checklist: ApprovalChecklist;
  documents: ApprovalDocument[];
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

type ApprovalType =
  | 'partner_registration'     // pendaftaran partner baru
  | 'village_registration'     // pendaftaran desa baru
  | 'accommodation_submission' // submission properti penginapan
  | 'experience_coordination'  // koordinasi event/experience
  | 'withdrawal_request';      // pencairan dana

type ApprovalStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'revision_required'
  | 'rejected';

interface ApprovalChecklist {
  businessInfo: boolean;
  documents: boolean;
  location: boolean;
  financial: boolean;
  media: boolean;
}
```

### Workflow

```
[Partner Submit] → pending → [Admin Review] → under_review
                                    ├── approved ✅ → partner aktif
                                    ├── revision_required 🔄 → partner revisi → re-submit
                                    └── rejected ❌ → notifikasi alasan
```

### Fitur Detail
- [x] Tab view: All | Pending | Under Review | Approved | Rejected
- [x] Badge counter per status
- [x] Checklist verification (centang item yang sudah valid)
- [x] Completion score bar (progress kelengkapan dokumen)
- [x] Preview dokumen (KTP, SIUP, foto lokasi)
- [x] Action buttons: Approve, Request Revision (+ notes), Reject (+ reason)
- [x] Bulk approve (untuk batch verification)
- [x] Notification ke partner setelah status berubah
- [x] Timeline/history per approval request

### Referensi Mitra-Dewi
- `PartnerApplicationStatus`: `pending → under_review → approved | revision_required | rejected`
- `AccommodationSubmissionStatus`: `draft → submitted → revision | approved | suspended`
- `ExperienceCoordination.status`: proposal → review → changes_requested → facility_reserved → terms_agreed → approved/rejected
- Checklist fields: businessInfo, documents, location, financial, media

---

## Fitur 5: Otentikasi & Otorisasi (JWT / OAuth)

### Deskripsi
Sistem keamanan akses admin panel menggunakan JWT + refresh token, dengan opsi OAuth untuk SSO.

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Login | `/login` | Form login admin |
| Forgot Password | `/forgot-password` | Reset password via email |
| Reset Password | `/reset-password` | Set password baru |

### Arsitektur Auth

```typescript
interface AuthState {
  user: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

interface JWTPayload {
  sub: string;           // user id
  email: string;
  role: AdminRole;
  permissions: string[]; // ['users.view', 'users.create', ...]
  iat: number;
  exp: number;
}
```

### Fitur Detail
- [x] JWT access token (15 menit) + refresh token (7 hari, httpOnly cookie)
- [x] Auto refresh sebelum expiry (silent refresh)
- [x] Login rate limiting (max 5 attempts / 15 menit → lockout 30 menit)
- [x] Password policy: min 8 char, uppercase, lowercase, number, special char
- [x] Forgot password flow (email link, expire 1 jam)
- [x] OAuth2 support: Google Workspace SSO (opsional)
- [x] Session management: lihat active sessions, force logout remote
- [x] Middleware Next.js: validasi token di setiap request ke `(dashboard)` routes
- [x] CSRF protection pada form
- [x] Zustand auth store dengan secure persist (encrypt sensitive data)

### Rekomendasi Keamanan
- Gunakan **next-auth v5** (Auth.js) sebagai abstraksi auth
- Access token di memory (Zustand), refresh token di httpOnly cookie
- Implementasi IP whitelist untuk super_admin (opsional)
- 2FA (TOTP) untuk admin role dan super_admin

---

## Fitur 6: Pengaturan Web (TnC, Privacy Policy, dll)

### Deskripsi
CMS sederhana untuk mengelola konten legal dan informational yang ditampilkan di platform desa-wisata (public-facing).

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Content List | `/settings/content` | Daftar semua halaman konten |
| Content Editor | `/settings/content/[slug]` | Rich text editor |
| Content Preview | `/settings/content/[slug]/preview` | Preview tampilan publik |

### Data Model

```typescript
interface WebContent {
  id: string;
  slug: ContentSlug;
  title: string;
  content: string;         // HTML / Markdown
  status: 'draft' | 'published';
  version: number;         // versioning untuk rollback
  locale: 'id' | 'en';    // multi-bahasa
  publishedAt?: string;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
}

type ContentSlug =
  | 'terms-and-conditions'
  | 'privacy-policy'
  | 'refund-policy'
  | 'about-us'
  | 'faq'
  | 'contact'
  | 'partner-guidelines'
  | 'community-guidelines';
```

### Fitur Detail
- [x] Rich text editor (Tiptap / BlockNote)
- [x] Version history + rollback ke versi sebelumnya
- [x] Draft / Publish toggle
- [x] Multi-bahasa (ID / EN) — sesuai desa-wisata yang sudah support i18n
- [x] SEO metadata (meta title, description, keywords)
- [x] Preview rendering sebelum publish
- [x] Slug-based routing di frontend publik

---

## Fitur 7: Audit Log & Monitoring Aktivitas

### Deskripsi
Tracking semua aktivitas user di admin panel dan platform mitra-dewi untuk keamanan dan compliance.

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Audit Log | `/audit-logs` | Timeline aktivitas dengan filter |
| User Activity | `/users/[id]/activity` | Aktivitas spesifik per user |

### Data Model

```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: AdminRole | PartnerRole;
  action: AuditAction;
  module: PermissionModule;
  resourceType: string;      // 'user' | 'village' | 'approval' | 'transaction' | 'setting'
  resourceId: string;
  description: string;
  metadata: Record<string, unknown>;  // detail perubahan (before/after)
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
}

type AuditAction =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'export'
  | 'bulk_action'
  | 'settings_change'
  | 'password_reset'
  | 'role_change';
```

### Fitur Detail
- [x] Timeline view dengan infinite scroll
- [x] Filter: user, action type, module, date range, status
- [x] Search by description / resource ID
- [x] Detail modal: before/after diff untuk update actions
- [x] Export audit log (CSV) untuk compliance
- [x] Retention policy: simpan log 1 tahun
- [x] Alert otomatis untuk suspicious activity:
  - Login dari IP/lokasi baru
  - Multiple failed login attempts
  - Bulk delete operations
  - Permission escalation
  - Off-hours access

---

## Fitur 8: Monitor Transaksi

### Deskripsi
Dashboard monitoring seluruh transaksi dari platform desa-wisata dan mitra-dewi, termasuk revenue sharing, refund, dan settlement.

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Transaction List | `/transactions` | Semua transaksi dengan filter |
| Transaction Detail | `/transactions/[id]` | Detail transaksi + payment splits |
| Refund Management | `/transactions/refunds` | Daftar refund request |
| Settlement | `/transactions/settlements` | Status pencairan dana ke partner |
| Revenue Report | `/transactions/revenue` | Laporan revenue platform |

### Data Model

```typescript
interface TransactionMonitor {
  id: string;
  orderId: string;
  type: TransactionType;        // 'accommodation' | 'sme_order' | 'experience' | 'facility_rental'
  status: PaymentStatus;        // 'pending' | 'success' | 'failed' | 'refunded'
  amount: number;
  currency: 'IDR';
  platformFee: number;
  paymentMethod: string;        // 'va_bca' | 'ewallet_gopay' | 'qris' | etc.
  paymentProvider: PaymentProvider; // 'midtrans' | 'xendit' | 'doku'

  // Relasi
  buyerUserId: string;
  buyerName: string;
  partnerUserId: string;
  partnerName: string;
  villageId: string;
  villageName: string;

  // Revenue split
  splits: PaymentSplit[];

  // Refund (jika ada)
  refund?: {
    type: 'full' | 'partial';
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'processed' | 'rejected';
    requestedAt: string;
    processedAt?: string;
  };

  // Settlement
  settlement?: {
    status: 'pending' | 'processing' | 'completed';
    schedule: 'standard' | 'express' | 'instant'; // T+7 | T+1 | T+0
    completedAt?: string;
  };

  createdAt: string;
  updatedAt: string;
}

interface PaymentSplit {
  recipientType: 'partner' | 'village' | 'platform';
  recipientId: string;
  recipientName: string;
  amount: number;
  percentage: number;
}
```

### Revenue Sharing Rules (Referensi Mitra-Dewi)

| Tipe Transaksi | Partner | Village | Platform |
|----------------|:-------:|:-------:|:--------:|
| Accommodation | 85% | — | 15% |
| SME Order | 90% | — | 10% |
| Experience (Village) | 85% | — | 15% |
| Experience (External) | 60% | 25% | 15% |
| Facility Rental | — | 85% | 15% |

### Fitur Detail
- [x] Tabel transaksi: tanggal, tipe, buyer, partner, desa, amount, status
- [x] Filter: tipe, status, payment method, date range, desa, partner
- [x] Summary cards: total hari ini, pending, success rate, total refund
- [x] Transaction detail: payment splits breakdown, timeline status
- [x] Refund management: approve/reject refund requests
- [x] Settlement tracking: status pencairan ke partner
- [x] Revenue report: grafik revenue per periode, per tipe, per desa
- [x] Export transaksi (CSV/Excel) untuk rekonsiliasi
- [x] Flag suspicious transactions (amount anomaly, velocity check)

---

## Fitur 9: Manajemen Multi Desa

### Deskripsi
Mengelola registrasi, profil, dan status operasional semua desa wisata yang terdaftar di platform.

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| Village List | `/villages` | Daftar semua desa + status |
| Village Detail | `/villages/[id]` | Profil lengkap desa |
| Village Edit | `/villages/[id]/edit` | Edit data desa |
| Village Partners | `/villages/[id]/partners` | Partner di desa tersebut |
| Village Analytics | `/villages/[id]/analytics` | Performa desa |

### Data Model

```typescript
interface VillageManagement {
  id: string;
  name: string;
  slug: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  latitude: number;
  longitude: number;
  description: string;
  history?: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
    };
  };
  gallery: string[];
  videoUrl?: string;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  governmentServices: GovernmentService[];
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  verifiedAt?: string;
  stats: {
    totalPartners: number;
    totalFacilities: number;
    totalExperiences: number;
    monthlyRevenue: number;
    averageRating: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface GovernmentService {
  type: 'clinic' | 'hospital' | 'fire_department' | 'police' | 'pharmacy';
  name: string;
  phone: string;
  address: string;
  isPriority: boolean;
  coordinates?: { latitude: number; longitude: number };
}
```

### Fitur Detail
- [x] Tabel desa: nama, lokasi, status, jumlah partner, revenue, rating
- [x] Map view: peta Indonesia dengan marker semua desa (Leaflet / Mapbox)
- [x] Register desa baru (oleh admin)
- [x] Verifikasi kelengkapan data desa
- [x] Suspend / reactivate desa
- [x] Per-desa analytics: revenue trend, partner breakdown, top experiences
- [x] Partner list per desa: VILLAGE_ADMIN, ACCOMMODATION, UMKM, EVENT_ORGANIZER
- [x] Government services management (referensi: emergency services di mitra-dewi)
- [x] Bulk import desa (CSV upload)

### Referensi Mitra-Dewi
- `VillageProfile`: name, address, lat/lng, history, contact, socialMedia, gallery, bankInfo, governmentServices
- `GovernmentService`: type (clinic/hospital/fire/police/pharmacy), isPriority, coordinates
- Partner roles per village: setiap desa punya 1 VILLAGE_ADMIN + multiple partners

---

## Fitur 10: Pengaturan Aplikasi

### Deskripsi
Konfigurasi platform-wide settings yang mengontrol behavior apps desa-wisata dan mitra-dewi.

### Halaman & Komponen

| Halaman | Route | Deskripsi |
|---------|-------|-----------|
| General Settings | `/settings/app` | Pengaturan umum platform |
| Payment Settings | `/settings/payment` | Konfigurasi payment gateway |
| Notification Settings | `/settings/notifications` | Template & channel notifikasi |
| Feature Flags | `/settings/features` | Toggle fitur on/off |
| Maintenance | `/settings/maintenance` | Mode maintenance |

### Data Model

```typescript
interface AppSettings {
  general: {
    platformName: string;
    platformLogo: string;
    supportEmail: string;
    supportPhone: string;
    defaultLocale: 'id' | 'en';
    timezone: string;            // 'Asia/Jakarta'
    maintenanceMode: boolean;
    maintenanceMessage?: string;
  };
  payment: {
    activeProvider: PaymentProvider;
    midtransConfig: {
      serverKey: string;         // encrypted
      clientKey: string;
      isProduction: boolean;
    };
    enabledMethods: string[];    // ['va_bca', 'ewallet_gopay', 'qris']
    minimumTransaction: number;  // IDR
    maximumTransaction: number;
    cancellationPolicies: {
      accommodation: CancellationPolicy;
      experience: CancellationPolicy;
    };
  };
  revenue: {
    defaultSplits: Record<TransactionType, RevenueSplit>;
    settlementSchedule: 'standard' | 'express' | 'instant';
    autoSettlement: boolean;
  };
  notifications: {
    emailProvider: 'sendgrid' | 'ses' | 'smtp';
    smsProvider?: 'twilio' | 'nexmo';
    pushEnabled: boolean;
    templates: NotificationTemplate[];
  };
  featureFlags: {
    enableOAuth: boolean;
    enableRefunds: boolean;
    enableMultiLanguage: boolean;
    enableExperienceCoordination: boolean;
    enablePaymentSplit: boolean;
    maxVillagesPerAdmin: number;
  };
}
```

### Fitur Detail
- [x] Form settings dengan auto-save atau explicit save
- [x] Environment indicator (development / staging / production)
- [x] Payment gateway toggle (sandbox ↔ production)
- [x] Revenue split konfigurasi per tipe transaksi
- [x] Notification template editor (email subject, body, variables)
- [x] Feature flags: toggle fitur tanpa deploy
- [x] Maintenance mode: aktifkan/nonaktifkan + custom message
- [x] Backup & restore settings
- [x] Settings change log (siapa mengubah apa kapan)

---

## Rekomendasi Tambahan untuk Admin DeWi

### A. Notification Center

```
Route: /notifications
```
- Real-time notification bell di header
- Aggregated notifications dari mitra-dewi dan desa-wisata
- Kategori: approval requests, transaction alerts, system alerts, partner messages
- Push notification (browser) + email digest (daily/weekly)
- Referensi: Mitra-dewi sudah punya 24 notification types mapped ke roles

### B. Report Generator

```
Route: /reports
```
- Template laporan: harian, mingguan, bulanan
- Custom report builder (pilih metrics, filter, date range)
- Scheduled report (auto-generate & kirim via email)
- Format export: PDF, Excel, CSV
- Laporan wajib:
  - Rekap transaksi bulanan per desa
  - Revenue sharing settlement report
  - Partner performance ranking
  - User growth & retention

### C. Support Ticket System

```
Route: /support
```
- Ticketing untuk keluhan/bertanya dari partner dan user
- Status: open → in_progress → resolved → closed
- Priority: low, medium, high, urgent
- Assign ke admin/support team
- Canned responses (template jawaban)
- SLA tracking (response time, resolution time)

### D. Announcement / Broadcast

```
Route: /announcements
```
- Buat pengumuman untuk semua partner / per desa / per role
- Channel: in-app banner, push notification, email
- Schedule publish (tanggal & jam tertentu)
- Target audience selector (role, desa, status)

### E. API Key Management

```
Route: /settings/api
```
- Generate & manage API keys untuk integrasi third-party
- Rate limiting per API key
- Usage monitoring & analytics
- Webhook configuration untuk event-driven integrations
- API documentation link (Swagger/OpenAPI)

### F. Backup & Data Management

```
Route: /settings/data
```
- Database backup scheduling (daily automatic)
- Data export per modul (GDPR compliance)
- Data retention policy configuration
- Bulk data import (CSV/JSON)
- Data anonymization tools (untuk dev/staging)

---

## Arsitektur Integrasi

```
┌─────────────────────────────────────────────────────┐
│                   Admin DeWi (FE)                    │
│              Next.js 15 + TypeScript                 │
│         Zustand · shadcn/ui · Recharts               │
├─────────────────────────────────────────────────────┤
│                     API Layer                        │
│           REST API / tRPC / GraphQL                  │
├──────────┬──────────────┬───────────────────────────┤
│          │              │                           │
│  ┌───────▼──────┐ ┌────▼────────┐ ┌───────────────┐│
│  │  Auth Service │ │  Admin API  │ │ Notification  ││
│  │  (next-auth)  │ │  (Backend)  │ │   Service     ││
│  └──────┬───────┘ └─────┬───────┘ └───────┬───────┘│
│         │               │                 │         │
├─────────▼───────────────▼─────────────────▼─────────┤
│                    Database                          │
│              PostgreSQL / MySQL                      │
│         + Redis (cache & session)                    │
├─────────────────────────────────────────────────────┤
│              External Services                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Midtrans │ │ SendGrid │ │ Cloudinary│ │ Sentry │ │
│  │ (Payment)│ │ (Email)  │ │ (Storage) │ │ (Error)│ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└─────────────────────────────────────────────────────┘

         ▼ Data Sync ▼

┌──────────────────┐    ┌──────────────────┐
│    Mitra DeWi    │    │   Desa Wisata    │
│ (Partner Portal) │    │ (Public Website) │
│  Next.js 15+     │    │  Next.js 15+     │
└──────────────────┘    └──────────────────┘
```

---

## Rekomendasi Tech Stack Tambahan

| Kebutuhan | Library | Alasan |
|-----------|---------|--------|
| Chart/Graph | **Recharts** | Lightweight, React-native, composable |
| Rich Text Editor | **Tiptap** | Extensible, headless, ProseMirror-based |
| Table | **TanStack Table v8** | Headless, sorting, filtering, pagination built-in |
| Date Picker | **date-fns** + shadcn DatePicker | Lightweight date utility |
| File Upload | **react-dropzone** | Drag & drop, file validation |
| Map | **react-leaflet** | Free, sudah dipakai di mitra-dewi |
| PDF Export | **@react-pdf/renderer** | Generate PDF reports |
| Excel Export | **exceljs** | Generate Excel with formatting |
| Real-time | **SSE / Pusher** | Notifications, live dashboard |
| Error Tracking | **Sentry** | Error monitoring production |
| Analytics | **PostHog** | Self-hosted product analytics |

---

## Route Summary

```
/login                          # Auth
/forgot-password
/reset-password

/dashboard                      # Dashboard utama

/users                          # CRUD user
/users/create
/users/[id]
/users/[id]/edit
/users/[id]/activity

/roles                          # Role & permission
/roles/[id]
/roles/[id]/edit

/villages                       # Multi desa
/villages/[id]
/villages/[id]/edit
/villages/[id]/partners
/villages/[id]/analytics

/approvals                      # Approval management
/approvals/[id]
/approvals/history

/transactions                   # Monitor transaksi
/transactions/[id]
/transactions/refunds
/transactions/settlements
/transactions/revenue

/audit-logs                     # Audit & monitoring

/reports                        # Report generator (rekomendasi)

/support                        # Support tickets (rekomendasi)

/announcements                  # Broadcast (rekomendasi)

/notifications                  # Notification center (rekomendasi)

/settings/app                   # Pengaturan umum
/settings/payment               # Payment gateway config
/settings/notifications         # Notification config
/settings/features              # Feature flags
/settings/maintenance           # Maintenance mode
/settings/content               # CMS (TnC, Privacy, dll)
/settings/content/[slug]
/settings/api                   # API key management (rekomendasi)
/settings/data                  # Backup & data (rekomendasi)
```

---

## Acceptance Criteria

- [ ] Semua 10 fitur utama memiliki halaman dan fungsionalitas dasar
- [ ] RBAC berjalan: role tanpa permission tidak bisa akses fitur tertentu
- [ ] Dashboard menampilkan KPI real-time dari data platform
- [ ] Approval workflow sesuai flow mitra-dewi (pending → review → approve/reject)
- [ ] Auth menggunakan JWT dengan refresh token
- [ ] Audit log mencatat semua aksi CRUD dan perubahan status
- [ ] Transaksi menampilkan revenue split sesuai aturan mitra-dewi
- [ ] Multi-desa: bisa kelola N desa dari satu admin panel
- [ ] Settings perubahan tersimpan dan berlaku di platform
- [ ] Responsive design (desktop-first, mobile-friendly)
- [ ] Unit test coverage minimal 70% untuk business logic
- [ ] E2E test untuk critical path: login, approval, transaction view

---

## Referensi

- [ISSUE-001: Project Setup](./ISSUE-001-project-setup.md) — scaffolding & folder structure
- [Bulletproof React](https://github.com/alan2207/bulletproof-react) — architecture pattern
- Mitra DeWi source code — types, stores, payment, revenue sharing, approval workflow
- [shadcn/ui](https://ui.shadcn.com/) — component library
- [Recharts](https://recharts.org/) — charting library
- [TanStack Table](https://tanstack.com/table) — headless table
- [Tiptap](https://tiptap.dev/) — rich text editor
