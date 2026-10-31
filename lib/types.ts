export type Role = 'guru' | 'penilai' | 'admin';

export type EvaluatorType = 'Kepala Sekolah' | 'Pengawas Sekolah' | 'Guru Senior';

export interface User {
  id?: string;
  name: string;
  username: string;
  role: Role;
  evaluatorType?: EvaluatorType;
}

export interface RegisteredUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: Role;
  evaluatorType?: EvaluatorType;
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
  evaluatorType?: EvaluatorType;
  status: 'menunggu' | 'ditugaskan' | 'selesai';
  feedback?: string;
  skor?: number | null;
  catatanPenilai?: string;
  createdAt: string;
  updatedAt: string;
}

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
  }
];

export const INITIAL_SAMPLE_JADWAL: JadwalItem[] = [];