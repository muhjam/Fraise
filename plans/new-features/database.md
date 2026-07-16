# Pembaharuan Sistem Bimbel: Database, Page Structure & Logic Plan

## 1. Requirement Summary
Sistem platform Bimbingan Belajar (Bimbel) dengan role sbb:
- **Admin**: Terdiri dari **Owner** (pemilik Bimbel) dan **Teacher** (staff pengajar).
- **Student**: Peserta didik / pengguna reguler.

**Aturan Logika Bisnis:**
- 1 Email = 1 Role = 1 Bimbel (tidak bisa multi-role atau cross-bimbel dengan email yang sama).
- Auth Redirection: 
  - Admin (Owner/Teacher) -> diarahkan ke `/dashboard/home`
  - Student -> diarahkan ke `/moduls`

## 2. Struktur Database (Schema)
Menggunakan database relasional:

### Tabel `bimbels`
- `id` (PK, UUID)
- `name` (String, nama bimbel)
- `created_at` (Timestamp)

### Tabel `users`
- `id` (PK, UUID)
- `email` (String, UNIQUE) - menjamin 1 email tidak duplikat
- `password_hash` (String)
- `role` (Enum: 'OWNER', 'TEACHER', 'STUDENT')
- `bimbel_id` (FK -> bimbels.id)
- `created_at` (Timestamp)

### Tabel `modules`
- `id` (PK, UUID)
- `bimbel_id` (FK -> bimbels.id)
- `title` (String)
- `content_url` atau `content` (String/Text)
- `created_by` (FK -> users.id) - author modul
- `created_at` (Timestamp)

---

## 3. Struktur Halaman (App Directory Structure)

Next.js App Router Structure (`src/app/`):

```text
src/app/
 ├── (auth)/
 │    └── login/
 │         └── page.tsx        # Halaman Login Utama
 ├── (admin)/
 │    └── dashboard/
 │         ├── layout.tsx      # Sidebar & Header khusus admin 
 │         ├── home/
 │         │    └── page.tsx   # Overview Bimbel, menu Owner & Teacher
 │         └── [modul_managements... dll]
 ├── (student)/
 │    └── moduls/
 │         ├── page.tsx        # Grid card materi untuk peserta (Student view)
 │         └── [id]/
 │              └── page.tsx   # Halaman baca materi / kerjakan tugas
 ├── api/
 │    └── auth/
 │         ├── login/route.ts  # Endpoint verifikasi akun & assign Cookie/JWT
 │         └── me/route.ts     # Cek kredensial aktif
 └── home-screen.tsx           # Update: Tambah Button Navbar `Login` -> route ke `/login`
```

---

## 4. UI/UX Component & Referensi Template

Semua UI harus dibuat interaktif menggunakan base components `src/components/base` dan terinspirasi dari `src/app-template`:

1. **Login Page (`/login`)**
   - **Template**: Mengambil komponen yang sudah disiapkan di `src/components/shared-assets/login/`.
   - **Komponen**: Form otentikasi standar (email/password) terintegrasi dengan shared layout.
2. **Setup Navbar Publik (`home-screen.tsx`)**
   - Sisipkan `<Button onClick={() => router.push('/login')}>Login</Button>` di samping fitur ThemeToggle.
3. **Admin Dashboard (`/dashboard/home`)**
   - **Template**: Me-reuse layout kompleks seperti `dashboards-01.tsx` atau `dashboards-03.tsx`.
   - **Isi Konten**: Overview metrik, akses pengolahan guru (Bagi Owner), dan penambahan materi pembelajaran.
4. **Student View (`/moduls`)**
   - **Template**: Area Dashboard dengan view tipe Grid, seperti `dashboards-10.tsx` (yang biasanya punya layout items list/grid minimalis).
   - **Isi Konten**: Kotak-kotak modul materi milik bimbel yang bisa diklik peserta.

---

## 5. Implementasi Logika (Logic & State Management)

### A. Setup State Management (Zustand)
Gunakan `use-auth-store.ts` di sisi client agar informasi user bisa diakses global tanpa *prop-drilling*:
```typescript
interface AuthState {
  user: { id: string; email: string; role: 'OWNER' | 'TEACHER' | 'STUDENT'; bimbel_id: string } | null;
  isAuthenticated: boolean;
  login: (userData) => void;
  logout: () => void;
}
```

### B. Middleware Proteksi Halaman (`src/middleware.ts`)
Gunakan *Next.js Middleware* untuk proteksi sebelum user dapat render halaman:
- Jika role = `STUDENT` mengakses `/dashboard/*` -> *Redirect to `/moduls`* atau error `403`.
- Jika role = `OWNER`/`TEACHER` mengakses `/moduls` -> *Redirect to `/dashboard/home`* (opsional jika dilarang).
- Jika ada pengguna belum login (guest) mengakses `/dashboard/*` atau `/moduls/*` -> *Redirect to `/login`*.

### C. Alur Endpoint API Login (`/api/auth/login`)
1. User memasukkan kredensial POST { email, password }.
2. Validasi dengan tabel `users`.
3. Verifikasi `password_hash`.
4. Jika valid, *generate Security Token* (misal: JWT atau HttpOnly Cookie) berisi payload `{ id, role, bimbel_id }`.
5. Return 200 OK beserta profil user di body.
6. Client (halaman login) membaca HTTP Response:
   - Jika response melempar `role="OWNER"` / `"TEACHER"` -> eksekusi `router.push('/dashboard/home')`
   - Jika response melempar `role="STUDENT"` -> eksekusi `router.push('/moduls')`

## 6. Development Phases (Urutan Pengerjaan)
1. **Fase 1: Struktur Data**. Inisialisasi Database menggunakan **Prisma v6.0 + PostgreSQL (Supabase)** (tabel `users`, `bimbels`, `modules`).
2. **Fase 2: Backend Auth**. Membuat endpoint `/login` dan middleware route protection NEXT.
3. **Fase 3: State & Entry Point**. Memperbarui Navbar Landing Page (`home-screen.tsx`), Setting global `Zustand`, buat `/login` page.
4. **Fase 4: Core Admin Ui**. Kembangkan navigasi layout `/dashboard` dan `/dashboard/home` mengambil style template.
5. **Fase 5: Core Student Ui**. Kembangkan layout list grid pada `/moduls` mengambil style template.
