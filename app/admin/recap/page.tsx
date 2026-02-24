'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileSpreadsheet, Printer, Loader2, Calendar, MapPin, Trash2, Archive, RotateCcw, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { KECAMATAN_KAMPAR } from '@/lib/constants';

export default function RecapPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [recapData, setRecapData] = useState<any[]>([]);
    const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [kecamatan, setKecamatan] = useState('Semua Kec.');
    const [showArchived, setShowArchived] = useState(false);
    const [userRole, setUserRole] = useState<string>('');

    const fetchRecap = async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role === 'staff_penmad') {
                    router.push('/admin/dashboard');
                    return;
                }
                setUserRole(user.role);
            }

            const response = await api.admin.getRecap({ archived: showArchived ? 1 : 0 });
            const data = await response.json();
            if (response.ok) {
                setRecapData(data.data || data);
            }
        } catch (error) {
            console.error('Failed to fetch recap:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecap();
    }, [showArchived]);

    if (isLoading && !userRole) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Loader2 className="animate-spin text-emerald-700" size={64} />
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Menyiapkan Dokumen Rekap...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in -mt-6 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card title="REKAP BULANAN" className="hover:shadow-2xl transition-all duration-500">
                    <div className="space-y-10">
                        <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2rem] relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-110 transition-transform text-emerald-900 duration-700">
                                <FileSpreadsheet size={150} />
                            </div>
                            <p className="text-emerald-900 font-black uppercase text-[10px] tracking-[0.2em] mb-3">Download Rekap Bulanan</p>
                            <p className="text-emerald-700 font-bold relative z-10 leading-relaxed text-sm">
                                Unduh rekapitulasi data (Siswa, Guru, Keuangan) per kecamatan dalam format Excel atau PDF.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="input-label">Pilih Periode</label>
                                <div className="relative group">
                                    <input
                                        type="month"
                                        className="select-field border-2 pr-14 hover:border-emerald-500 transition-all cursor-pointer"
                                        value={bulan}
                                        onChange={(e) => setBulan(e.target.value)}
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-emerald-600 transition-colors">
                                        <Calendar size={18} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="input-label">Filter Kecamatan</label>
                                <div className="relative group">
                                    <select
                                        className="select-field border-2 appearance-none pr-14 hover:border-emerald-500 transition-all cursor-pointer uppercase"
                                        value={kecamatan}
                                        onChange={(e) => setKecamatan(e.target.value)}
                                    >
                                        <option value="Semua Kec.">Semua Kec.</option>
                                        {KECAMATAN_KAMPAR.map(k => (
                                            <option key={k} value={k}>{k}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-emerald-600 transition-colors">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="primary"
                                icon={<FileSpreadsheet size={20} />}
                                className="flex-1 !py-5 !text-sm shadow-xl shadow-emerald-200/50 hover:scale-[1.02] transition-transform"
                            >
                                UNDUH EXCEL
                            </Button>
                            <Button
                                variant="outline"
                                icon={<Printer size={20} />}
                                className="flex-1 !py-5 !text-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                CETAK PDF
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card title="STATISTIK TAHUNAN" className="hover:shadow-2xl transition-all duration-500">
                    <div className="space-y-10">
                        <div className="bg-blue-50 border-2 border-blue-100 p-8 rounded-[2rem] relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:scale-110 transition-transform text-blue-900 duration-700">
                                <Printer size={150} />
                            </div>
                            <p className="text-blue-900 font-black uppercase text-[10px] tracking-[0.2em] mb-3">Analisis Tahunan</p>
                            <p className="text-blue-700 font-bold leading-relaxed text-sm">
                                Cetak grafik kepatuhan dan ringkasan data personil per tahun ajaran untuk laporan berkala.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="input-label">Tahun Pelajaran</label>
                                <div className="relative group">
                                    <select className="select-field border-2 appearance-none pr-14 hover:border-blue-500 transition-all cursor-pointer">
                                        <option>2025/2026</option>
                                        <option>2024/2025</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="input-label">Siklus Laporan</label>
                                <div className="relative group">
                                    <select className="select-field border-2 appearance-none pr-14 hover:border-blue-500 transition-all cursor-pointer">
                                        <option>Semester Ganjil</option>
                                        <option>Semester Genap</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="outline"
                                icon={<Printer size={20} />}
                                className="flex-1 !py-5 !text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                PREVIEW PDF
                            </Button>
                            <Button
                                variant="outline"
                                icon={<FileSpreadsheet size={20} />}
                                className="flex-1 !py-5 !text-sm border-slate-200"
                            >
                                EXPORT EXCEL
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
