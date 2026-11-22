import type { CareerEvent } from '../types/event.types'

/**
 * Data contoh lokal untuk UI "Event & Workshop".
 * Backend belum menyediakan endpoint event; data ini hanya dipakai mock
 * service dan TIDAK mewakili kontrak API apa pun. Nama pembicara & organizer
 * bersifat fiktif. Sampul belum tersedia (null) → UI menampilkan placeholder.
 */

const onlineNotes = [
  'Link meeting akan dikirim H-1 via email',
  'Pastikan email Anda aktif',
  'Recording tersedia untuk peserta terdaftar',
  'Sertifikat digital akan dikirim setelah event',
]

const offlineNotes = [
  'Detail lokasi & denah akan dikirim H-3 via email',
  'Tunjukkan email konfirmasi saat registrasi ulang',
  'Datang 30 menit sebelum acara dimulai',
]

export const eventsMock: CareerEvent[] = [
  {
    id: 'resume-writing-workshop',
    title: 'Resume Writing Workshop for Women',
    summary:
      'Pelajari cara membuat resume yang menarik perhatian recruiter dan menonjolkan keahlian Anda.',
    description:
      'Workshop interaktif yang akan mengajarkan Anda cara membuat resume yang menarik perhatian recruiter dan menonjolkan keahlian serta pengalaman Anda dengan efektif.',
    category: 'workshop',
    isGirlBossEvent: true,
    startsAt: '2026-11-25T14:00:00+07:00',
    endsAt: '2026-11-25T16:00:00+07:00',
    location: 'Online - Zoom',
    organizer: 'GirlBoss Team',
    coverImageUrl: null,
    capacity: 100,
    registeredCount: 45,
    isFree: true,
    agenda: [
      'Pembukaan dan Introduction (10 menit)',
      'Struktur Resume yang Efektif (30 menit)',
      'Tips Menulis Achievement-Oriented Bullets (30 menit)',
      'Design & Formatting Best Practices (20 menit)',
      'Review & Q&A Session (30 menit)',
    ],
    speakers: [
      { name: 'Dr. Sarah Amanda', role: 'Career Coach & HR Expert' },
      { name: 'Linda Kartini', role: 'Senior Recruiter' },
    ],
    preparations: [
      'Laptop/PC dengan koneksi internet stabil',
      'Aplikasi Zoom (akan dibagikan link via email)',
      'Draft resume Anda (optional, untuk review session)',
    ],
    benefits: [
      'Materi lengkap dalam bentuk PDF',
      'Template resume profesional',
      'E-Certificate kehadiran',
      'Akses recording workshop selama 7 hari',
      'Networking dengan peserta lain',
    ],
    importantNotes: onlineNotes,
  },
  {
    id: 'tech-career-fair',
    title: 'Tech Career Fair',
    summary:
      'Temui puluhan perusahaan teknologi yang aktif merekrut talenta perempuan dalam satu hari.',
    description:
      'Career fair tatap muka yang mempertemukan pencari kerja dengan perusahaan teknologi. Siapkan CV terbaikmu dan ikuti sesi interview on-the-spot.',
    category: 'career-fair',
    isGirlBossEvent: false,
    startsAt: '2026-11-28T09:00:00+07:00',
    endsAt: '2026-11-28T16:00:00+07:00',
    location: 'Jakarta Convention Center',
    organizer: 'Tech Talent Indonesia',
    coverImageUrl: null,
    capacity: 500,
    registeredCount: 342,
    isFree: true,
    agenda: [
      'Registrasi ulang & pembukaan (60 menit)',
      'Company booth & walk-in interview (4 jam)',
      'Talkshow: Karier Perempuan di Dunia Tech (60 menit)',
    ],
    speakers: [{ name: 'Rina Hapsari', role: 'Engineering Manager' }],
    preparations: [
      'Beberapa salinan CV terbaru',
      'Pakaian semi-formal',
      'Portofolio digital (opsional)',
    ],
    benefits: [
      'Kesempatan interview langsung',
      'Akses ke lowongan eksklusif peserta',
      'Goodie bag dari sponsor',
    ],
    importantNotes: offlineNotes,
  },
  {
    id: 'women-in-leadership',
    title: 'Women in Leadership Webinar',
    summary:
      'Diskusi bersama pemimpin perempuan tentang membangun karier kepemimpinan yang berkelanjutan.',
    description:
      'Webinar inspiratif yang membahas tantangan dan strategi perempuan untuk tumbuh menjadi pemimpin di tempat kerja.',
    category: 'webinar',
    isGirlBossEvent: true,
    startsAt: '2026-11-30T19:00:00+07:00',
    endsAt: '2026-11-30T20:30:00+07:00',
    location: 'Online - Zoom',
    organizer: 'GirlBoss Team',
    coverImageUrl: null,
    capacity: 300,
    registeredCount: 188,
    isFree: true,
    agenda: [
      'Pembukaan (10 menit)',
      'Panel diskusi (50 menit)',
      'Tanya jawab (30 menit)',
    ],
    speakers: [
      { name: 'Ayu Pratiwi', role: 'Chief Operating Officer' },
      { name: 'Maya Lestari', role: 'Leadership Coach' },
    ],
    preparations: ['Koneksi internet stabil', 'Pertanyaan untuk sesi diskusi'],
    benefits: ['E-Certificate kehadiran', 'Akses recording selama 7 hari'],
    importantNotes: onlineNotes,
  },
  {
    id: 'salary-negotiation-masterclass',
    title: 'Salary Negotiation Masterclass',
    summary:
      'Kuasai seni negosiasi gaji dan dapatkan kompensasi yang sesuai dengan value Anda.',
    description:
      'Masterclass praktis tentang riset gaji, menyusun argumen nilai diri, dan simulasi negosiasi dengan rekruter berpengalaman.',
    category: 'workshop',
    isGirlBossEvent: false,
    startsAt: '2026-12-02T10:00:00+07:00',
    endsAt: '2026-12-02T12:00:00+07:00',
    location: 'Online - Zoom',
    organizer: 'Creative Studio',
    coverImageUrl: null,
    capacity: 150,
    registeredCount: 67,
    isFree: true,
    agenda: [
      'Riset standar gaji industri (30 menit)',
      'Menyusun value proposition (30 menit)',
      'Simulasi negosiasi berpasangan (45 menit)',
      'Q&A (15 menit)',
    ],
    speakers: [{ name: 'Dian Puspita', role: 'Talent Acquisition Lead' }],
    preparations: ['Data gaji saat ini/target', 'Kamera aktif untuk simulasi'],
    benefits: ['Worksheet negosiasi', 'E-Certificate kehadiran'],
    importantNotes: onlineNotes,
  },
  {
    id: 'personal-branding-workshop',
    title: 'Personal Branding Workshop',
    summary:
      'Bangun personal brand yang kuat di media sosial dan tingkatkan visibility profesional Anda.',
    description:
      'Workshop untuk merapikan profil profesional, menentukan positioning, dan membuat rencana konten yang konsisten.',
    category: 'workshop',
    isGirlBossEvent: false,
    startsAt: '2026-12-08T13:00:00+07:00',
    endsAt: '2026-12-08T15:00:00+07:00',
    location: 'Online - Zoom',
    organizer: 'E-Commerce Giant',
    coverImageUrl: null,
    capacity: 200,
    registeredCount: 112,
    isFree: true,
    agenda: [
      'Menentukan positioning diri (30 menit)',
      'Optimasi profil profesional (45 menit)',
      'Rencana konten 30 hari (45 menit)',
    ],
    speakers: [{ name: 'Putri Anggraini', role: 'Brand Strategist' }],
    preparations: ['Akun profesional yang aktif', 'Laptop/PC'],
    benefits: ['Template rencana konten', 'E-Certificate kehadiran'],
    importantNotes: onlineNotes,
  },
  {
    id: 'women-in-data-meetup',
    title: 'Women in Data Networking Night',
    summary:
      'Perluas jaringan profesional bersama praktisi data, analis, dan engineer perempuan.',
    description:
      'Malam networking santai dengan lightning talk singkat dan sesi speed networking antarpeserta.',
    category: 'networking',
    isGirlBossEvent: true,
    startsAt: '2026-12-12T18:30:00+07:00',
    endsAt: '2026-12-12T21:00:00+07:00',
    location: 'Bandung Creative Hub',
    organizer: 'GirlBoss Team',
    coverImageUrl: null,
    capacity: 80,
    registeredCount: 80,
    isFree: true,
    agenda: [
      'Registrasi & welcome drink (30 menit)',
      'Lightning talks (45 menit)',
      'Speed networking (60 menit)',
    ],
    speakers: [{ name: 'Nadia Rahma', role: 'Senior Data Scientist' }],
    preparations: ['Kartu nama atau profil digital', 'Perkenalan singkat 1 menit'],
    benefits: ['Relasi profesional baru', 'Akses komunitas Women in Data'],
    importantNotes: offlineNotes,
  },
  {
    id: 'interview-prep-webinar',
    title: 'Ace Your Interview Webinar',
    summary:
      'Strategi menjawab pertanyaan interview perilaku dengan metode STAR secara meyakinkan.',
    description:
      'Webinar praktis untuk mempersiapkan interview kerja, lengkap dengan contoh jawaban dan latihan singkat.',
    category: 'webinar',
    isGirlBossEvent: false,
    startsAt: '2026-12-16T19:00:00+07:00',
    endsAt: '2026-12-16T20:30:00+07:00',
    location: 'Online - Google Meet',
    organizer: 'PT Digital Indonesia',
    coverImageUrl: null,
    capacity: 250,
    registeredCount: 96,
    isFree: true,
    agenda: [
      'Memahami pola pertanyaan interview (20 menit)',
      'Metode STAR & contoh jawaban (40 menit)',
      'Latihan & umpan balik (30 menit)',
    ],
    speakers: [{ name: 'Fitri Handayani', role: 'HR Business Partner' }],
    preparations: ['Daftar pengalaman kerja utama', 'Koneksi internet stabil'],
    benefits: ['Bank pertanyaan interview', 'E-Certificate kehadiran'],
    importantNotes: onlineNotes,
  },
]
