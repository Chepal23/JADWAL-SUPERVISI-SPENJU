export type Role = 'guru' | 'penilai' | 'admin';

export interface User {
  id?: string;
  name: string;
  username: string;
  role: Role;
}

export interface RegisteredUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: Role;
  status: 'pending' | 'approved';
  createdAt: string;
}

export interface JadwalItem {
  id: string;
  guru: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jam: string;
  kelas: string;
  materi: string;
  jenis: string[];
  sasaran: string[];
  catatanGuru?: string;
  penilai: string | null;
  status: 'menunggu' | 'ditugaskan' | 'selesai';
  feedback?: string;
  skor?: number | null;
  catatanPenilai?: string;
  createdAt: string;
  updatedAt: string;
}

export const EVALUATOR_OPTIONS = [
  "Dra. Hj. Kepala Sekolah, M.Pd (Kepala Sekolah)"
];

export const SASARAN_LIST = [
  "Kelengkapan Administrasi Guru (RPP, Silabus, Prota, Promes)",
  "Kesesuaian RPP dengan pelaksanaan pembelajaran",
  "Pembukaan pelajaran (apersepsi & motivasi)",
  "Penguasaan materi pelajaran",
  "Strategi/metode pembelajaran yang digunakan",
  "Penggunaan media & sumber belajar",
  "Keterlibatan & partisipasi siswa",
  "Pengelolaan kelas & waktu",
  "Penilaian proses & hasil belajar",
  "Penutupan pelajaran (refleksi & tindak lanjut)",
  "Sikap & keteladanan guru",
  "Pemanfaatan TIK dalam pembelajaran"
];

export const INITIAL_SAMPLE_USERS: RegisteredUser[] = [
  {
    id: 'USR-ADMIN',
    name: 'Paul (Admin)',
    username: 'paul',
    password: 'paul',
    role: 'admin',
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'USR-1',
    name: 'Budi Santoso, S.Pd',
    username: 'budi',
    password: 'budi123',
    role: 'guru',
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'USR-2',
    name: 'Maria Kogoya, S.Pd',
    username: 'maria',
    password: 'maria123',
    role: 'guru',
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_SAMPLE_JADWAL: JadwalItem[] = [
  {
    id: 'SUP-1730000001001',
    guru: 'Budi Santoso, S.Pd',
    hari: 'Senin',
    jam: 'Jam ke-2 (07.40-08.20)',
    kelas: 'VIII-A',
    materi: 'Matematika - Teorema Pythagoras',
    jenis: ['Administrasi', 'Pembelajaran'],
    sasaran: [
      "Kelengkapan Administrasi Guru (RPP, Silabus, Prota, Promes)",
      "Penguasaan materi pelajaran",
      "Keterlibatan & partisipasi siswa"
    ],
    catatanGuru: 'Media peraga visual siap digunakan di kelas.',
    penilai: 'Dra. Hj. Kepala Sekolah, M.Pd (Kepala Sekolah)',
    status: 'selesai',
    feedback: 'Penyampaian materi sangat interaktif. Siswa antusias menggunakan alat peraga segitiga siku-siku. Administrasi lengkap.',
    skor: 92,
    catatanPenilai: 'Pertahankan metode diskusi kelompok yang sangat efektif.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'SUP-1730000002002',
    guru: 'Maria Kogoya, S.Pd',
    hari: 'Selasa',
    jam: 'Jam ke-3 (08.20-09.00)',
    kelas: 'VII-B',
    materi: 'Bahasa Indonesia - Teks Deskripsi',
    jenis: ['Pembelajaran'],
    sasaran: [
      "Pembukaan pelajaran (apersepsi & motivasi)",
      "Strategi/metode pembelajaran yang digunakan",
      "Penggunaan media & sumber belajar"
    ],
    catatanGuru: 'Siswa akan diminta mendeskripsikan lingkungan sekitar sekolah.',
    penilai: null,
    status: 'menunggu',
    feedback: '',
    skor: null,
    catatanPenilai: '',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];