'use client';

import React, { useState } from 'react';
import {
  User,
  RegisteredUser,
  JadwalItem,
  EvaluatorType,
  SchoolSettings,
  DEFAULT_SCHOOL_SETTINGS,
  SASARAN_LIST,
  INITIAL_SAMPLE_JADWAL,
  INITIAL_SAMPLE_USERS
} from '@/lib/types';
import {
  ClipboardCheck,
  ClipboardList,
  UserCheck,
  LogOut,
  PieChart,
  Edit3,
  List,
  CalendarDays,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  UserPlus,
  FileText,
  Printer,
  Download,
  Upload,
  RefreshCw,
  Search,
  School,
  BookOpen,
  GraduationCap,
  Award,
  Shield,
  Sliders,
  Calendar,
  CheckCircle,
  Hourglass,
  ArrowRight,
  AlertCircle,
  Check,
  UserPlus2,
  Lock,
  KeyRound,
  UserCheck2,
  XCircle,
  UserCog
} from 'lucide-react';

export default function SupervisiClient() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('supervisi_user_smp7');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    if (typeof window === 'undefined') return INITIAL_SAMPLE_USERS;
    const saved = localStorage.getItem('supervisi_users_db_smp7');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SAMPLE_USERS;
      }
    }
    localStorage.setItem('supervisi_users_db_smp7', JSON.stringify(INITIAL_SAMPLE_USERS));
    return INITIAL_SAMPLE_USERS;
  });

  const [jadwalList, setJadwalList] = useState<JadwalItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_SAMPLE_JADWAL;
    const savedData = localStorage.getItem('supervisi_smp7_data');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return INITIAL_SAMPLE_JADWAL;
      }
    }
    localStorage.setItem('supervisi_smp7_data', JSON.stringify(INITIAL_SAMPLE_JADWAL));
    return INITIAL_SAMPLE_JADWAL;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'isi' | 'daftar' | 'pemetaan' | 'konfirmasi' | 'laporan' | 'ai-asisten' | 'panduan' | 'pengaturan'>('dashboard');

  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SCHOOL_SETTINGS;
    const saved = localStorage.getItem('supervisi_school_settings_smp7');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SCHOOL_SETTINGS;
      }
    }
    return DEFAULT_SCHOOL_SETTINGS;
  });

  const [settingsForm, setSettingsForm] = useState<SchoolSettings>(schoolSettings);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolSettings(settingsForm);
    localStorage.setItem('supervisi_school_settings_smp7', JSON.stringify(settingsForm));
    showToast('Pengaturan sekolah & laporan berhasil diperbarui!');
  };

  // Login inputs
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'guru' | 'penilai'>('guru');
  const [regEvaluatorType, setRegEvaluatorType] = useState<EvaluatorType>('Guru Senior');

  // Form states (Isi Jadwal)
  const [editId, setEditId] = useState('');
  const [hari, setHari] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'>('Senin');
  const [jam, setJam] = useState('Jam ke-1 (07.00-07.40)');
  const [kelas, setKelas] = useState('VII-A');
  const [materi, setMateri] = useState('');
  const [jenisSupervisi, setJenisSupervisi] = useState<string[]>(['Pembelajaran']);
  const [sasaranSelected, setSasaranSelected] = useState<string[]>([]);
  const [catatanGuru, setCatatanGuru] = useState('');
  const [selectedPenilaiId, setSelectedPenilaiId] = useState('');

  // Filter & Search
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Report format
  const [reportFormat, setReportFormat] = useState<'jadwal' | 'rekap'>('jadwal');

  // Modal detail
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalItem | null>(null);
  const [inputSkor, setInputSkor] = useState<number>(85);
  const [inputFeedback, setInputFeedback] = useState('');
  const [inputCatatanPenilai, setInputCatatanPenilai] = useState('');
  const [assignedEvaluatorName, setAssignedEvaluatorName] = useState('');

  // AI Assistant
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ text: string; groundingChunks: any[] } | null>(null);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to query AI');
      setAiResult({ text: data.text, groundingChunks: data.groundingChunks || [] });
    } catch (err: any) {
      showToast(err.message || 'Gagal menghubungi asisten AI', true);
    } finally {
      setAiLoading(false);
    }
  };

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);

  const saveData = (newList: JadwalItem[]) => {
    setJadwalList(newList);
    localStorage.setItem('supervisi_smp7_data', JSON.stringify(newList));
  };

  const saveUsers = (newUsers: RegisteredUser[]) => {
    setRegisteredUsers(newUsers);
    localStorage.setItem('supervisi_users_db_smp7', JSON.stringify(newUsers));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const uname = loginUsername.trim().toLowerCase();
    const pwd = loginPassword;

    if (!uname || !pwd) {
      showToast('Username dan password wajib diisi', true);
      return;
    }

    if (uname === 'paul' && pwd === 'paul') {
      const adminUser: User = { id: 'USR-ADMIN', name: 'Paul (Admin)', username: 'paul', role: 'admin' };
      setCurrentUser(adminUser);
      localStorage.setItem('supervisi_user_smp7', JSON.stringify(adminUser));
      showToast('Selamat datang, Paul (Admin)!');
      return;
    }

    const found = registeredUsers.find(u => u.username.toLowerCase() === uname && u.password === pwd);
    if (!found) {
      showToast('Username atau password salah!', true);
      return;
    }

    if (found.status === 'pending') {
      showToast('Akun Anda masih menunggu konfirmasi dari Admin sekolah.', true);
      return;
    }

    const user: User = { id: found.id, name: found.name, username: found.username, role: found.role, evaluatorType: found.evaluatorType };
    setCurrentUser(user);
    localStorage.setItem('supervisi_user_smp7', JSON.stringify(user));
    showToast(`Selamat datang, ${found.name}!`);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const name = regName.trim();
    const uname = regUsername.trim().toLowerCase();
    const pwd = regPassword;

    if (!name || !uname || !pwd) {
      showToast('Semua field registrasi wajib diisi', true);
      return;
    }

    if (uname === 'paul') {
      showToast('Username paul khusus untuk Admin.', true);
      return;
    }

    if (registeredUsers.some(u => u.username.toLowerCase() === uname)) {
      showToast('Username sudah digunakan, silakan gunakan username lain.', true);
      return;
    }

    const newRegUser: RegisteredUser = {
      id: 'USR-' + (registeredUsers.length + 1),
      name,
      username: uname,
      password: pwd,
      role: regRole,
      evaluatorType: regRole === 'penilai' ? regEvaluatorType : undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    saveUsers([...registeredUsers, newRegUser]);
    showToast('Registrasi berhasil! Menunggu konfirmasi Admin sekolah.');
    setLoginMode('login');
    setRegName('');
    setRegUsername('');
    setRegPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('supervisi_user_smp7');
    setLoginUsername('');
    setLoginPassword('');
    showToast('Berhasil keluar akun');
  };

  const handleApproveUser = (userId: string) => {
    const updated = registeredUsers.map(u => u.id === userId ? { ...u, status: 'approved' as const } : u);
    saveUsers(updated);
    showToast('Akun berhasil dikonfirmasi / disetujui');
  };

  const handleRejectUser = (userId: string) => {
    const updated = registeredUsers.filter(u => u.id !== userId);
    saveUsers(updated);
    showToast('Akun ditolak dan dihapus dari daftar');
  };

  const handleCheckboxSasaran = (item: string) => {
    if (sasaranSelected.includes(item)) {
      setSasaranSelected(sasaranSelected.filter(s => s !== item));
    } else {
      setSasaranSelected([...sasaranSelected, item]);
    }
  };

  const handleCheckboxJenis = (item: string) => {
    if (jenisSupervisi.includes(item)) {
      if (jenisSupervisi.length === 1) {
        showToast('Minimal pilih 1 jenis supervisi', true);
        return;
      }
      setJenisSupervisi(jenisSupervisi.filter(j => j !== item));
    } else {
      setJenisSupervisi([...jenisSupervisi, item]);
    }
  };

  const handleSubmitJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materi.trim()) {
      showToast('Mata Pelajaran / Materi wajib diisi', true);
      return;
    }
    if (sasaranSelected.length === 0) {
      showToast('Pilih minimal 1 sasaran KBM', true);
      return;
    }

    // Find penilai name from selected penilai ID
    let assignedPenilaiName = null;
    let assignedEvaluatorType = undefined;
    if (selectedPenilaiId) {
      const foundPenilai = registeredUsers.find(u => u.id === selectedPenilaiId);
      if (foundPenilai) {
        assignedPenilaiName = `${foundPenilai.name} (${foundPenilai.evaluatorType || 'Penilai'})`;
        assignedEvaluatorType = foundPenilai.evaluatorType;
      }
    }

    if (editId) {
      const updated = jadwalList.map(j => {
        if (j.id === editId) {
          return {
            ...j,
            hari,
            jam,
            kelas,
            materi,
            jenis: jenisSupervisi,
            sasaran: sasaranSelected,
            catatanGuru,
            penilai: assignedPenilaiName || j.penilai,
            evaluatorType: assignedEvaluatorType || j.evaluatorType,
            status: assignedPenilaiName ? ('ditugaskan' as const) : j.status,
            updatedAt: new Date().toISOString()
          };
        }
        return j;
      });
      saveData(updated);
      showToast('Jadwal supervisi berhasil diperbarui');
      setEditId('');
    } else {
      const newItem: JadwalItem = {
        id: 'SUP-' + (jadwalList.length + 1),
        guru: currentUser?.name || 'Guru',
        hari,
        jam,
        kelas,
        materi,
        jenis: jenisSupervisi,
        sasaran: sasaranSelected,
        catatanGuru,
        penilai: assignedPenilaiName,
        evaluatorType: assignedEvaluatorType,
        status: assignedPenilaiName ? 'ditugaskan' : 'menunggu',
        feedback: '',
        skor: null,
        catatanPenilai: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveData([newItem, ...jadwalList]);
      showToast('Jadwal kesiapan supervisi berhasil disimpan');
    }

    setMateri('');
    setCatatanGuru('');
    setSasaranSelected([]);
    setSelectedPenilaiId('');
    setEditId('');
    setActiveTab('daftar');
  };

  const handleEditJadwal = (item: JadwalItem) => {
    if (currentUser?.role === 'guru' && item.guru !== currentUser.name) {
      showToast('Anda hanya dapat mengedit jadwal Anda sendiri', true);
      return;
    }
    setEditId(item.id);
    setHari(item.hari);
    setJam(item.jam);
    setKelas(item.kelas);
    setMateri(item.materi);
    setJenisSupervisi(item.jenis);
    setSasaranSelected(item.sasaran);
    setCatatanGuru(item.catatanGuru || '');
    setActiveTab('isi');
  };

  const handleDeleteJadwal = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;
    const filtered = jadwalList.filter(j => j.id !== id);
    saveData(filtered);
    showToast('Jadwal berhasil dihapus');
  };

  const handleAssignPenilaiAdmin = (id: string, penilaiUserId: string) => {
    const foundPenilai = registeredUsers.find(u => u.id === penilaiUserId);
    if (!foundPenilai) return;
    const penilaiNameStr = `${foundPenilai.name} (${foundPenilai.evaluatorType || 'Penilai'})`;

    const updated = jadwalList.map(j => {
      if (j.id === id) {
        return {
          ...j,
          penilai: penilaiNameStr,
          evaluatorType: foundPenilai.evaluatorType,
          status: j.status === 'menunggu' ? ('ditugaskan' as const) : j.status,
          updatedAt: new Date().toISOString()
        };
      }
      return j;
    });
    saveData(updated);
    showToast(`Penilai "${penilaiNameStr}" berhasil ditugaskan`);
    if (selectedJadwal && selectedJadwal.id === id) {
      setSelectedJadwal(updated.find(j => j.id === id) || null);
    }
  };

  const handleSaveFeedback = (id: string) => {
    const updated = jadwalList.map(j => {
      if (j.id === id) {
        return {
          ...j,
          skor: inputSkor,
          feedback: inputFeedback,
          catatanPenilai: inputCatatanPenilai,
          status: 'selesai' as const,
          penilai: j.penilai || currentUser?.name || 'Penilai',
          updatedAt: new Date().toISOString()
        };
      }
      return j;
    });
    saveData(updated);
    showToast('Umpan balik dan penilaian berhasil disimpan');
    setSelectedJadwal(null);
  };

  const resetSampleData = () => {
    if (!confirm('Reset semua data ke data contoh awal?')) return;
    saveData(INITIAL_SAMPLE_JADWAL);
    showToast('Data direset ke contoh awal');
  };

  const exportDataJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jadwalList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", 'jadwal_supervisi_smp7_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data berhasil diexport ke JSON');
  };

  // Approved Penilai list for dropdown selection
  const approvedPenilaiList = registeredUsers.filter(u => u.role === 'penilai' && u.status === 'approved');

  // Stats
  const totalJadwal = jadwalList.length;
  const menungguPenilai = jadwalList.filter(j => j.status === 'menunggu').length;
  const sudahDinilai = jadwalList.filter(j => j.status === 'selesai').length;
  const totalGuru = new Set(jadwalList.map(j => j.guru)).size;
  const pendingUsersCount = registeredUsers.filter(u => u.status === 'pending').length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <School className="w-8 h-8" />
            </div>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              SMP Negeri 7 Sentani
            </span>
            <h1 className="text-2xl font-extrabold text-slate-800 mt-2">Jadwal Supervisi Guru KBM</h1>
            <p className="text-slate-500 text-sm mt-1">Sistem Administrasi & Pembelajaran</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setLoginMode('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                loginMode === 'login' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                loginMode === 'register' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Registrasi Akun Baru
            </button>
          </div>

          {toast && (
            <div className={`mb-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              toast.isError ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {toast.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
              <span>{toast.message}</span>
            </div>
          )}

          {loginMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Username (guru1, penilai1, atau paul)"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Password akun Anda"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Masuk Aplikasi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.Pd"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Peran</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                >
                  <option value="guru">Guru KBM</option>
                  <option value="penilai">Penilai / Supervisor / Pengawas</option>
                </select>
              </div>

              {regRole === 'penilai' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Penilai</label>
                  <select
                    value={regEvaluatorType}
                    onChange={(e) => setRegEvaluatorType(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50 font-medium text-indigo-700"
                  >
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Pengawas Sekolah">Pengawas Sekolah</option>
                    <option value="Guru Senior">Guru Senior / Mentor</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Buat Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Buat Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Daftar Akun Baru</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                Registrasi akan ditinjau dan dikonfirmasi oleh Admin sekolah.
              </p>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-1">
            <p className="text-[11px] text-slate-500">
              Demo Guru 1: <strong className="text-indigo-600">guru1</strong> / <strong className="text-indigo-600">guru2026</strong>
            </p>
            <p className="text-[11px] text-slate-500">
              Demo Penilai (Kasek): <strong className="text-indigo-600">penilai1</strong> / <strong className="text-indigo-600">penilai2026</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter jadwal
  const filteredJadwal = jadwalList.filter(item => {
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchQuery = item.guru.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.materi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.kelas.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner">
              <School className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Jadwal Supervisi Guru KBM</h1>
                <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-medium">SMPN 7 Sentani</span>
              </div>
              <p className="text-blue-100 text-xs md:text-sm">Administrasi & Pembelajaran Guru</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10">
            <div className="text-right">
              <p className="font-bold text-sm">{currentUser.name}</p>
              <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
                {currentUser.role === 'guru' ? 'Guru KBM' : currentUser.role === 'penilai' ? `Penilai (${currentUser.evaluatorType || 'Supervisor'})` : 'Admin Sekolah'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="bg-white/20 hover:bg-white/30 p-2.5 rounded-xl transition text-white shadow-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-white transition-all transform duration-300 animate-bounce ${
          toast.isError ? 'bg-rose-600' : 'bg-slate-900'
        }`}>
          {toast.isError ? <AlertCircle className="w-5 h-5 text-rose-200" /> : <CheckCircle className="w-5 h-5 text-emerald-400" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* NAV TABS (MENUS & SUBMENUS BERDASARKAN PERAN) */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/80">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {currentUser.role === 'guru' && (
            <button
              onClick={() => {
                setEditId('');
                setMateri('');
                setCatatanGuru('');
                setSasaranSelected([]);
                setSelectedPenilaiId('');
                setActiveTab('isi');
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
                activeTab === 'isi'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{editId ? 'Edit Jadwal' : 'Isi Jadwal Kesiapan'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('daftar')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'daftar'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <List className="w-4 h-4" />
            <span>
              {currentUser.role === 'guru' ? 'Jadwal & Hasil Penilaian Saya' : currentUser.role === 'penilai' ? 'Daftar Tugas Observasi Penilai' : 'Daftar Semua Supervisi'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pemetaan')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'pemetaan'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Pemetaan Mingguan</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('konfirmasi')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition relative ${
                activeTab === 'konfirmasi'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserCheck2 className="w-4 h-4" />
              <span>Konfirmasi Akun</span>
              {pendingUsersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {pendingUsersCount}
                </span>
              )}
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => {
                setSettingsForm(schoolSettings);
                setActiveTab('pengaturan');
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
                activeTab === 'pengaturan'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Pengaturan Admin</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('laporan')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'laporan'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laporan & Cetak</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-asisten')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'ai-asisten'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Asisten Kurikulum AI</span>
          </button>

          <button
            onClick={() => setActiveTab('panduan')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'panduan'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-300" />
            <span>Panduan Penggunaan</span>
          </button>
        </div>

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Total Jadwal</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{totalJadwal}</p>
                  </div>
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <ClipboardList className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Menunggu Penilai</p>
                    <p className="text-3xl font-extrabold text-amber-600 mt-1">{menungguPenilai}</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                    <Hourglass className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Sudah Dinilai</p>
                    <p className="text-3xl font-extrabold text-emerald-600 mt-1">{sudahDinilai}</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Guru Terdaftar</p>
                    <p className="text-3xl font-extrabold text-blue-600 mt-1">{totalGuru}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                </div>
              </div>
            </div>

            {currentUser.role === 'admin' && pendingUsersCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-amber-900 text-base">Ada {pendingUsersCount} Akun Baru Menunggu Konfirmasi</h4>
                    <p className="text-xs text-amber-700 mt-0.5">Kepala Sekolah, Pengawas, Guru Senior, atau Guru KBM baru telah mendaftar.</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('konfirmasi')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-sm"
                >
                  Konfirmasi Akun
                </button>
              </div>
            )}

            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                  Sistem Penilai Terspesialisasi & Privasi Penilaian
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-3">SMP Negeri 7 Sentani</h2>
                <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                  {currentUser.role === 'guru'
                    ? 'Anda dapat memilih Penilai (Kepala Sekolah, Pengawas Sekolah, atau Guru Senior) saat mengisi jadwal kesiapan mengajar.'
                    : currentUser.role === 'penilai'
                    ? `Anda masuk sebagai ${currentUser.evaluatorType || 'Penilai'}. Akses daftar tugas observasi dan lembar penilaian KBM khusus untuk Anda.`
                    : 'Kelola pendaftaran akun penilai (Kepala Sekolah, Pengawas, Guru Senior) dan penugasan supervisi.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {currentUser.role === 'guru' && (
                    <button
                      onClick={() => setActiveTab('isi')}
                      className="bg-white text-indigo-900 hover:bg-blue-50 font-bold px-6 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Pilih Penilai & Isi Jadwal KBM</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('daftar')}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-2xl backdrop-blur-md transition flex items-center gap-2 text-sm border border-white/20"
                  >
                    <List className="w-4 h-4" />
                    <span>Lihat Daftar Jadwal & Tugas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ISI JADWAL KESIAPAN (GURU) DENGAN OPSI PILIH PENILAI */}
        {activeTab === 'isi' && currentUser.role === 'guru' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 animate-fadeIn max-w-4xl mx-auto">
            <div className="border-b pb-5 mb-6">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                Form Kesiapan & Pemilihan Penilai
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 mt-2">
                {editId ? 'Edit Jadwal Supervisi KBM' : 'Form Kesiapan Supervisi KBM'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Tentukan jadwal kelas dan pilih Penilai Anda (Kepala Sekolah, Pengawas, atau Guru Senior) agar persiapan maksimal.
              </p>
            </div>

            <form onSubmit={handleSubmitJadwal} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Guru</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.name}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Penilai / Supervisor *</label>
                  <select
                    required
                    value={selectedPenilaiId}
                    onChange={(e) => setSelectedPenilaiId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50 font-semibold text-indigo-900"
                  >
                    <option value="">-- Pilih Penilai (Kepala Sekolah / Pengawas / Guru Senior) --</option>
                    {approvedPenilaiList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — [{p.evaluatorType || 'Penilai'}]
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">Penilai yang Anda pilih akan menyiapkan instrumen dan hadir di kelas.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Hari Kesiapan *</label>
                  <select
                    value={hari}
                    onChange={(e) => setHari(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  >
                    <option value="Senin">Senin</option><option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option><option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option><option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Jam Pelajaran *</label>
                  <select
                    value={jam}
                    onChange={(e) => setJam(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  >
                    <option>Jam ke-1 (07.00-07.40)</option><option>Jam ke-2 (07.40-08.20)</option>
                    <option>Jam ke-3 (08.20-09.00)</option><option>Jam ke-4 (09.15-09.55)</option>
                    <option>Jam ke-5 (09.55-10.35)</option><option>Jam ke-6 (10.35-11.15)</option>
                    <option>Jam ke-7 (11.15-11.55)</option><option>Jam ke-8 (12.30-13.10)</option>
                    <option>Jam ke-9 (13.10-13.50)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Kelas *</label>
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  >
                    <option value="VII-A">VII-A</option><option value="VII-B">VII-B</option><option value="VII-C">VII-C</option><option value="VII-D">VII-D</option>
                    <option value="VIII-A">VIII-A</option><option value="VIII-B">VIII-B</option><option value="VIII-C">VIII-C</option><option value="VIII-D">VIII-D</option>
                    <option value="IX-A">IX-A</option><option value="IX-B">IX-B</option><option value="IX-C">IX-C</option><option value="IX-D">IX-D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mata Pelajaran / Topik Materi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: IPA - Sistem Pencernaan Manusia"
                  value={materi}
                  onChange={(e) => setMateri(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Supervisi *</label>
                <div className="flex flex-wrap gap-4">
                  {['Administrasi', 'Pembelajaran'].map(item => (
                    <label key={item} className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-indigo-50 transition">
                      <input
                        type="checkbox"
                        checked={jenisSupervisi.includes(item)}
                        onChange={() => handleCheckboxJenis(item)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Sasaran KBM yang Akan Diamati *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                  {SASARAN_LIST.map((sasaran, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                        sasaranSelected.includes(sasaran)
                          ? 'bg-indigo-50/80 border-indigo-300 shadow-sm'
                          : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/80'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={sasaranSelected.includes(sasaran)}
                        onChange={() => handleCheckboxSasaran(sasaran)}
                        className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-medium text-slate-700 leading-relaxed">{sasaran}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan Kesiapan (Opsional)</label>
                <textarea
                  rows={3}
                  placeholder="Catatan untuk penilai..."
                  value={catatanGuru}
                  onChange={(e) => setCatatanGuru(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId('');
                      setMateri('');
                      setCatatanGuru('');
                      setSasaranSelected([]);
                      setSelectedPenilaiId('');
                      setActiveTab('daftar');
                    }}
                    className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition text-sm"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-600/30 transition text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editId ? 'Perbarui Jadwal Kesiapan' : 'Simpan & Pilih Penilai'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: DAFTAR SUPERVISI & TUGAS PENILAI */}
        {activeTab === 'daftar' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  {currentUser.role === 'guru'
                    ? 'Jadwal & Hasil Penilaian Privasi Anda'
                    : currentUser.role === 'penilai'
                    ? `Daftar Tugas Observasi KBM (${currentUser.evaluatorType || 'Penilai'})`
                    : 'Daftar Semua Jadwal Supervisi'}
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {currentUser.role === 'guru'
                    ? 'Catatan dan hasil penilaian penilai Anda bersifat rahasia.'
                    : currentUser.role === 'penilai'
                    ? 'Daftar guru yang memilih Anda sebagai penilai atau ditugaskan oleh admin.'
                    : 'Kelola penugasan penilai (Kepala Sekolah, Pengawas, Guru Senior).'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Cari guru, materi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 w-full sm:w-60"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 font-medium"
                >
                  <option value="all">Semua Status</option>
                  <option value="menunggu">Menunggu Penilai</option>
                  <option value="ditugaskan">Ditugaskan</option>
                  <option value="selesai">Selesai Dinilai</option>
                </select>
              </div>
            </div>

            {filteredJadwal.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-700 text-lg">Tidak ada jadwal ditemukan</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJadwal.map(item => {
                  const isOwner = item.guru === currentUser.name;
                  const isAdmin = currentUser.role === 'admin';
                  const isAssignedEvaluator = currentUser.role === 'penilai' && item.penilai?.includes(currentUser.name);

                  // Confidentiality for teachers: guru can only view their own items
                  if (currentUser.role === 'guru' && !isOwner) return null;
                  // Penilai view: penilai can view items assigned to them
                  if (currentUser.role === 'penilai' && !isAssignedEvaluator && !isAdmin) return null;

                  return (
                    <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-extrabold text-slate-800 text-lg">{item.guru}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                              item.status === 'ditugaskan' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status === 'selesai' ? 'Selesai Dinilai' : item.status === 'ditugaskan' ? 'Ditugaskan' : 'Menunggu Penilai'}
                            </span>
                            {item.jenis.map(j => (
                              <span key={j} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                                {j}
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs md:text-sm text-slate-600 font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              <span>{item.hari}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-500" />
                              <span>{item.jam}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <School className="w-4 h-4 text-indigo-500" />
                              <span>Kelas {item.kelas}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-indigo-500" />
                              <span className="truncate">{item.materi}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100 text-slate-500 justify-between">
                            <div>
                              <span>Penilai Terpilih: </span>
                              <strong className={item.penilai ? 'text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg' : 'text-amber-600'}>
                                {item.penilai || 'Belum dipilih guru / ditunjuk admin'}
                              </strong>
                            </div>

                            {isAdmin && (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-700">Ubah Penilai:</span>
                                <select
                                  value=""
                                  onChange={(e) => handleAssignPenilaiAdmin(item.id, e.target.value)}
                                  className="px-3 py-1.5 rounded-xl border border-indigo-200 text-xs font-medium text-indigo-900 bg-indigo-50/50 outline-none"
                                >
                                  <option value="">-- Pilih Penilai Baru --</option>
                                  {approvedPenilaiList.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.evaluatorType})</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {item.skor !== null && item.skor !== undefined && (
                              <span>
                                Skor: <strong className="text-emerald-600 text-sm font-bold">{item.skor}/100</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0">
                          <button
                            onClick={() => {
                              setSelectedJadwal(item);
                              setInputSkor(item.skor || 85);
                              setInputFeedback(item.feedback || '');
                              setInputCatatanPenilai(item.catatanPenilai || '');
                            }}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{currentUser.role === 'guru' ? 'Lihat Hasil Privasi' : currentUser.role === 'penilai' ? 'Beri Penilaian KBM' : 'Detail'}</span>
                          </button>

                          {(isOwner || isAdmin) && currentUser.role !== 'penilai' && (
                            <>
                              <button
                                onClick={() => handleEditJadwal(item)}
                                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteJadwal(item.id)}
                                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: PEMETAAN MINGGUAN */}
        {activeTab === 'pemetaan' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">Pemetaan Jadwal Supervisi Mingguan</h2>
              <p className="text-slate-500 text-sm mb-6">Distribusi jadwal kesiapan guru mengajar berdasarkan hari dalam sepekan</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const).map(hari => {
                  const dayItems = jadwalList.filter(j => j.hari === hari);
                  return (
                    <div key={hari} className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm flex flex-col">
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-4 font-bold flex items-center justify-between">
                        <span>{hari}</span>
                        <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full">{dayItems.length} Sesi</span>
                      </div>
                      <div className="p-4 space-y-3 flex-1 bg-slate-50/50 max-h-80 overflow-y-auto">
                        {dayItems.length === 0 ? (
                          <p className="text-slate-400 text-xs text-center py-8">Tidak ada jadwal pada hari {hari}</p>
                        ) : (
                          dayItems.map(item => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedJadwal(item);
                                setInputSkor(item.skor || 85);
                                setInputFeedback(item.feedback || '');
                                setInputCatatanPenilai(item.catatanPenilai || '');
                              }}
                              className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm cursor-pointer transition card-hover"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-800 text-xs">{item.guru}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                  {item.kelas}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{item.jam}</p>
                              <p className="text-[11px] text-indigo-600 font-medium truncate mt-1">Penilai: {item.penilai || 'Belum'}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: KONFIRMASI AKUN (ADMIN ONLY) */}
        {activeTab === 'konfirmasi' && currentUser.role === 'admin' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 animate-fadeIn space-y-6">
            <div>
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                Manajemen Pendaftaran Pengguna
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 mt-2">Konfirmasi Akun Kepala Sekolah, Pengawas, Guru Senior & Guru KBM</h2>
              <p className="text-slate-500 text-sm mt-0.5">Setujui atau tolak pendaftaran akun baru sebelum dapat masuk ke sistem.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 text-left font-bold">
                    <th className="px-5 py-3.5">Nama Lengkap & Gelar</th>
                    <th className="px-5 py-3.5">Username</th>
                    <th className="px-5 py-3.5">Peran & Kategori Penilai</th>
                    <th className="px-5 py-3.5">Status Akun</th>
                    <th className="px-5 py-3.5 text-center">Aksi Konfirmasi</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map(u => (
                    <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-4 font-bold text-slate-800">{u.name}</td>
                      <td className="px-5 py-4 font-mono text-indigo-700">{u.username}</td>
                      <td className="px-5 py-4 capitalize font-semibold text-slate-600">
                        {u.role === 'penilai' ? `Penilai [${u.evaluatorType || 'Supervisor'}]` : 'Guru KBM'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {u.status === 'approved' ? 'Disetujui' : 'Menunggu Konfirmasi'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center space-x-2">
                        {u.status === 'pending' && (
                          <button
                            onClick={() => handleApproveUser(u.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                          >
                            Setujui
                          </button>
                        )}
                        <button
                          onClick={() => handleRejectUser(u.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: LAPORAN */}
        {activeTab === 'laporan' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 animate-fadeIn space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
              <div>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                  Dokumen Resmi Sekolah
                </span>
                <h2 className="text-2xl font-extrabold text-slate-800 mt-2">Laporan & Format Cetak Dokumen</h2>
                <p className="text-slate-500 text-sm mt-0.5">Pilih format dokumen untuk dibagikan (Jadwal Saja) atau rekapitulasi penilaian lengkap.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setReportFormat('jadwal')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      reportFormat === 'jadwal' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Format Jadwal Saja (Untuk Dibagikan)
                  </button>
                  <button
                    onClick={() => setReportFormat('rekap')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      reportFormat === 'rekap' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Format Rekap & Hasil Penilaian
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg transition flex items-center gap-2 text-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / PDF</span>
                </button>
              </div>
            </div>

            {/* PRINTABLE PREVIEW AREA */}
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6 print:bg-white print:border-none">
              <div className="text-center border-b-2 border-slate-800 pb-6">
                <h3 className="text-lg font-bold uppercase tracking-wide text-slate-700">{schoolSettings.agency}</h3>
                <h4 className="text-xl font-extrabold uppercase text-slate-900">{schoolSettings.department}</h4>
                <h2 className="text-2xl font-black uppercase text-indigo-900 mt-1">{schoolSettings.schoolName}</h2>
                <p className="text-xs text-slate-600 mt-1">
                  {schoolSettings.address} • Email: {schoolSettings.email}
                </p>
              </div>

              {reportFormat === 'jadwal' ? (
                <>
                  <div className="text-center my-4">
                    <h3 className="font-extrabold text-lg uppercase text-slate-800">JADWAL PELAKSANAAN SUPERVISI KBM (UNTUK DIBAGIKAN)</h3>
                    <p className="text-xs text-slate-500 mt-1">TAHUN AJARAN 2025/2026</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-300">
                      <thead>
                        <tr className="bg-slate-200 text-slate-800">
                          <th className="border border-slate-300 px-3 py-2.5">No</th>
                          <th className="border border-slate-300 px-3 py-2.5">Nama Guru</th>
                          <th className="border border-slate-300 px-3 py-2.5">Hari Pelaksanaan</th>
                          <th className="border border-slate-300 px-3 py-2.5">Jam Pelajaran</th>
                          <th className="border border-slate-300 px-3 py-2.5">Kelas</th>
                          <th className="border border-slate-300 px-3 py-2.5">Mata Pelajaran / Materi</th>
                          <th className="border border-slate-300 px-3 py-2.5">Penilai Ditunjuk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jadwalList.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-100">
                            <td className="border border-slate-300 px-3 py-2.5 text-center font-medium">{idx + 1}</td>
                            <td className="border border-slate-300 px-3 py-2.5 font-bold">{item.guru}</td>
                            <td className="border border-slate-300 px-3 py-2.5">{item.hari}</td>
                            <td className="border border-slate-300 px-3 py-2.5">{item.jam}</td>
                            <td className="border border-slate-300 px-3 py-2.5 text-center">{item.kelas}</td>
                            <td className="border border-slate-300 px-3 py-2.5">{item.materi}</td>
                            <td className="border border-slate-300 px-3 py-2.5 font-semibold text-indigo-700">{item.penilai || 'Belum ditentukan'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center my-4">
                    <h3 className="font-extrabold text-lg uppercase text-slate-800">BERITA ACARA REKAPITULASI PELAKSANAAN SUPERVISI KBM & HASIL PENILAIAN</h3>
                    <p className="text-xs text-slate-500 mt-1">TAHUN AJARAN 2025/2026</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-slate-300">
                      <thead>
                        <tr className="bg-slate-200 text-slate-800">
                          <th className="border border-slate-300 px-3 py-2">No</th>
                          <th className="border border-slate-300 px-3 py-2">Nama Guru</th>
                          <th className="border border-slate-300 px-3 py-2">Hari / Jam</th>
                          <th className="border border-slate-300 px-3 py-2">Kelas</th>
                          <th className="border border-slate-300 px-3 py-2">Mata Pelajaran</th>
                          <th className="border border-slate-300 px-3 py-2">Penilai</th>
                          <th className="border border-slate-300 px-3 py-2">Skor</th>
                          <th className="border border-slate-300 px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jadwalList.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-100">
                            <td className="border border-slate-300 px-3 py-2 text-center font-medium">{idx + 1}</td>
                            <td className="border border-slate-300 px-3 py-2 font-bold">{item.guru}</td>
                            <td className="border border-slate-300 px-3 py-2">{item.hari}, {item.jam.split(' ')[0]}</td>
                            <td className="border border-slate-300 px-3 py-2 text-center">{item.kelas}</td>
                            <td className="border border-slate-300 px-3 py-2">{item.materi}</td>
                            <td className="border border-slate-300 px-3 py-2">{item.penilai || '-'}</td>
                            <td className="border border-slate-300 px-3 py-2 text-center font-bold text-emerald-700">
                              {item.skor !== null && item.skor !== undefined ? `${item.skor}` : '-'}
                            </td>
                            <td className="border border-slate-300 px-3 py-2 text-center font-medium capitalize">
                              {item.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 pt-10 text-xs text-slate-800">
                <div className="text-center space-y-16">
                  <p className="font-semibold">Mengetahui,<br/>Kepala {schoolSettings.schoolName}</p>
                  <div>
                    <p className="font-bold underline">{schoolSettings.principalName}</p>
                    <p>{schoolSettings.principalNip}</p>
                  </div>
                </div>
                <div className="text-center space-y-16">
                  <p className="font-semibold">Sentani, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Koordinator Tim Supervisi</p>
                  <div>
                    <p className="font-bold underline">{schoolSettings.coordinatorName}</p>
                    <p>{schoolSettings.coordinatorNip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PENGATURAN ADMIN */}
        {activeTab === 'pengaturan' && currentUser.role === 'admin' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 animate-fadeIn space-y-6 max-w-4xl mx-auto">
            <div className="border-b pb-5">
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                Kustomisasi Instansi & Laporan
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 mt-2">Pengaturan Admin & Kop Laporan</h2>
              <p className="text-slate-500 text-sm mt-1">
                Ubah nama lembaga, dinas, sekolah, alamat, serta nama penandatangan laporan & berita acara supervisi.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lembaga / Pemerintah</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.agency}
                    onChange={(e) => setSettingsForm({ ...settingsForm, agency: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dinas / Instansi Terkait</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.department}
                    onChange={(e) => setSettingsForm({ ...settingsForm, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Sekolah / Satuan Pendidikan</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.schoolName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, schoolName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Sekolah</label>
                  <input
                    type="email"
                    required
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Sekolah</label>
                <input
                  type="text"
                  required
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Kepala Sekolah / Penandatangan 1</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.principalName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, principalName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.principalNip}
                    onChange={(e) => setSettingsForm({ ...settingsForm, principalNip: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Koordinator / Penandatangan 2</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.coordinatorName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, coordinatorName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">NIP Koordinator</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.coordinatorNip}
                    onChange={(e) => setSettingsForm({ ...settingsForm, coordinatorNip: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50/50 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Simpan Perubahan Pengaturan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: ASISTEN KURIKULUM AI (SEARCH GROUNDING) */}
        {activeTab === 'ai-asisten' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 animate-fadeIn space-y-6 max-w-4xl mx-auto">
            <div className="border-b pb-5">
              <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                <Sparkles className="w-3.5 h-3.5" /> Google Search Grounding (Gemini 3.8 Flash)
              </span>
              <h2 className="text-2xl font-extrabold text-slate-800 mt-2">Asisten Kurikulum & Pedagogi AI</h2>
              <p className="text-slate-500 text-sm mt-1">
                Ajukan pertanyaan tentang Kurikulum Merdeka, perangkat ajar RPP, metode pembelajaran, atau referensi materi KBM. AI akan melakukan pencarian web secara real-time.
              </p>
            </div>

            <form onSubmit={handleAskAi} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pertanyaan / Topik Pembelajaran</label>
                <div className="flex gap-2">
                  <textarea
                    rows={3}
                    required
                    placeholder="Contoh: Bagaimana rubrik penilaian observasi KBM untuk Kurikulum Merdeka?"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-end disabled:opacity-50 text-sm"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Mencari...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Tanya AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {aiResult && (
              <div className="space-y-6 bg-slate-50/80 p-6 rounded-2xl border border-slate-200 animate-fadeIn">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Jawaban Asisten Kurikulum:</span>
                  </h3>
                  <div className="prose prose-slate text-sm leading-relaxed whitespace-pre-wrap bg-white p-5 rounded-2xl border border-slate-200/80">
                    {aiResult.text}
                  </div>
                </div>

                {aiResult.groundingChunks && aiResult.groundingChunks.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-indigo-600" /> Sumber Referensi Web (Google Search Grounding):
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiResult.groundingChunks.map((chunk: any, i: number) => {
                        const web = chunk.web;
                        if (!web || !web.uri) return null;
                        return (
                          <a
                            key={i}
                            href={web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200 text-xs text-indigo-700 font-medium truncate flex items-center gap-2 transition shadow-sm"
                          >
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 shrink-0 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                            <span className="truncate">{web.title || web.uri}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: PANDUAN PENGGUNAAN */}
        {activeTab === 'panduan' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10 animate-fadeIn space-y-8 max-w-5xl mx-auto">
            <div className="border-b pb-5">
              <span className="bg-cyan-50 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                <BookOpen className="w-3.5 h-3.5" /> Panduan Resmi Penggunaan Aplikasi
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">Petunjuk Penggunaan untuk Guru, Penilai, & Admin</h2>
              <p className="text-slate-500 text-sm mt-1">
                Panduan langkah demi langkah bagi setiap pengguna SMP Negeri 7 Sentani dalam mengoperasikan sistem supervisi KBM.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* GURU */}
              <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  👨‍🏫
                </div>
                <div>
                  <h3 className="font-extrabold text-indigo-900 text-lg">Panduan untuk Guru KBM</h3>
                  <p className="text-xs text-indigo-700 mt-0.5">Langkah persiapan & pengisian kesiapan mengajar.</p>
                </div>
                <ol className="space-y-3 text-xs text-slate-700 leading-relaxed list-decimal list-inside">
                  <li><strong>Registrasi Akun:</strong> Buka halaman login, klik tab <em>Registrasi Akun Baru</em>. Masukkan nama lengkap, pilih peran <strong>Guru KBM</strong>, buat username & password Anda.</li>
                  <li><strong>Tunggu Konfirmasi:</strong> Akun baru akan berstatus *Menunggu Konfirmasi*. Hubungi Admin sekolah agar akun Anda disetujui.</li>
                  <li><strong>Masuk (Login):</strong> Setelah disetujui, masuk menggunakan username dan password Anda.</li>
                  <li><strong>Isi Jadwal & Pilih Penilai:</strong> Masuk ke menu <em>Isi Jadwal Kesiapan</em>. Tentukan hari, jam, kelas, materi, dan <strong>pilih Penilai Anda</strong> (Kepala Sekolah, Pengawas, atau Guru Senior).</li>
                  <li><strong>Lihat Hasil Rahasia:</strong> Hasil penilaian, skor, dan catatan penilai hanya dapat Anda lihat secara privat melalui menu Daftar Jadwal.</li>
                </ol>
              </div>

              {/* PENILAI */}
              <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  👩‍⚖️
                </div>
                <div>
                  <h3 className="font-extrabold text-emerald-900 text-lg">Panduan untuk Penilai</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">Kepala Sekolah, Pengawas & Guru Senior.</p>
                </div>
                <ol className="space-y-3 text-xs text-slate-700 leading-relaxed list-decimal list-inside">
                  <li><strong>Registrasi Akun:</strong> Pilih peran <strong>Penilai / Supervisor / Pengawas</strong> pada form registrasi, lalu tentukan kategori penilai Anda (<em>Kepala Sekolah</em>, <em>Pengawas Sekolah</em>, atau <em>Guru Senior</em>).</li>
                  <li><strong>Konfirmasi Admin:</strong> Tunggu hingga Admin menyetujui akun penilai Anda.</li>
                  <li><strong>Tugas Observasi KBM:</strong> Pada menu <em>Daftar Tugas Observasi</em>, Anda akan melihat jadwal guru yang memilih atau ditugaskan kepada Anda.</li>
                  <li><strong>Beri Penilaian & Umpan Balik:</strong> Klik detail sesi guru, masukkan skor kinerja (0-100), catatan observasi, dan rekomendasi tindak lanjut.</li>
                </ol>
              </div>

              {/* ADMIN */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  ⭐
                </div>
                <div>
                  <h3 className="font-extrabold text-amber-900 text-lg">Panduan untuk Admin</h3>
                  <p className="text-xs text-amber-700 mt-0.5">Kepala Sekolah / Operator Sistem.</p>
                </div>
                <ol className="space-y-3 text-xs text-slate-700 leading-relaxed list-decimal list-inside">
                  <li><strong>Login Admin:</strong> Masuk menggunakan username: <code className="bg-white px-1.5 py-0.5 rounded font-bold text-amber-900">paul</code> dan password: <code className="bg-white px-1.5 py-0.5 rounded font-bold text-amber-900">paul</code>.</li>
                  <li><strong>Konfirmasi Akun Baru:</strong> Buka tab <em>Konfirmasi Akun</em> untuk menyetujui atau menolak pendaftaran akun guru dan penilai baru.</li>
                  <li><strong>Penugasan & Pemantauan:</strong> Pantau pemetaan mingguan dan pastikan seluruh guru telah memiliki penilai.</li>
                  <li><strong>Cetak & Bagikan Jadwal:</strong> Buka tab <em>Laporan & Cetak</em> untuk mencetak <strong>Format Jadwal Saja (Untuk Dibagikan)</strong> atau <strong>Format Rekap & Hasil Penilaian</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DETAIL & FEEDBACK (DENGAN KERAHASIAAN PRIVASI) */}
      {selectedJadwal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-100 animate-scaleUp">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg text-slate-800">
                  {currentUser.role === 'guru' ? 'Hasil & Catatan Penilaian Privasi Anda' : 'Detail Supervisi & Penilaian'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJadwal(null)}
                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Guru:</span>
                  <strong className="text-slate-800">{selectedJadwal.guru}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jadwal KBM:</span>
                  <strong className="text-slate-800">{selectedJadwal.hari}, {selectedJadwal.jam}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas / Materi:</span>
                  <strong className="text-slate-800">Kelas {selectedJadwal.kelas} - {selectedJadwal.materi}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedJadwal.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedJadwal.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Penilai Dipilih:</span>
                  <strong className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {selectedJadwal.penilai || 'Belum dipilih'}
                  </strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-2">Sasaran KBM yang Diamati:</h4>
                <ul className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border">
                  {selectedJadwal.sasaran.map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {currentUser.role === 'guru' && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 space-y-1">
                    <p className="font-bold">Kerahasiaan Penilaian Pribadi</p>
                    <p>Catatan dan umpan balik dari Penilai Anda bersifat rahasia dan hanya dapat dilihat oleh Anda sendiri.</p>
                  </div>
                </div>
              )}

              {selectedJadwal.status === 'selesai' ? (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Umpan Balik & Catatan Penilai</span>
                    </h4>
                    <span className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full">
                      Skor: {selectedJadwal.skor}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Catatan / Umpan Balik Utama:</strong><br/>{selectedJadwal.feedback || '-'}
                  </p>
                  {selectedJadwal.catatanPenilai && (
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <strong>Rekomendasi / Tindak Lanjut:</strong><br/>{selectedJadwal.catatanPenilai}
                    </p>
                  )}
                  <p className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200">
                    Dinilai oleh: <strong>{selectedJadwal.penilai}</strong>
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800">
                  Sesi ini belum dinilai oleh penilai.
                </div>
              )}

              {/* JIKA USER ADALAH PENILAI YANG DITUNJUK ATAU ADMIN */}
              {(currentUser.role === 'admin' || currentUser.role === 'penilai') && (
                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-extrabold text-slate-800 text-sm">Form Penilaian & Umpan Balik Penilai ({currentUser.name})</h4>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Skor Kinerja (0 - 100)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputSkor}
                      onChange={(e) => setInputSkor(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Umpan Balik Pembelajaran *</label>
                    <textarea
                      rows={3}
                      value={inputFeedback}
                      onChange={(e) => setInputFeedback(e.target.value)}
                      placeholder="Catatan observasi KBM..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tindak Lanjut</label>
                    <textarea
                      rows={2}
                      value={inputCatatanPenilai}
                      onChange={(e) => setInputCatatanPenilai(e.target.value)}
                      placeholder="Rekomendasi..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
                    />
                  </div>

                  <button
                    onClick={() => handleSaveFeedback(selectedJadwal.id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan & Selesaikan Penilaian (Privasi Terjaga)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 SMP Negeri 7 Sentani • Aplikasi Jadwal Supervisi Guru KBM</p>
          <p className="text-slate-400">Sistem Penilaian Privasi & Penugasan Penilai Terpadu</p>
        </div>
      </footer>
    </div>
  );
}
