'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    FileClock,
    FileCheck,
    Megaphone,
    Loader2,
    ArrowUpRight,
    School,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function StaffDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        total_madrasah: 0,
        laporan_masuk: 0,
        terverifikasi: 0,
        recent_submissions: []
    });

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = await api.admin.getStats();
            const data = await response.json();
            if (response.ok) {
                const submissions = data.recent_submissions || data.data?.recent_submissions || [];
                setStats({
                    total_madrasah: data.total_madrasah || 0,
                    laporan_masuk: data.laporan_masuk || 0,
                    terverifikasi: data.terverifikasi || 0,
                    recent_submissions: Array.isArray(submissions) ? submissions : []
                });
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Loader2 className="animate-spin text-emerald-600" size={64} />
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Sinkronisasi Panel Kerja...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in -mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                <StatsCard
                    label="Tugas Validasi"
                    value={stats.laporan_masuk}
                    icon={<FileClock size={24} />}
                    color="emerald"
                />
                <StatsCard
                    label="Penyelesaian"
                    value={stats.terverifikasi}
                    icon={<FileCheck size={24} />}
                    color="emerald"
                />
                <StatsCard
                    label="Basis Madrasah"
                    value={stats.total_madrasah}
                    icon={<School size={24} />}
                    color="blue"
                />

                <div className="flex flex-col justify-center bg-white border-[3px] border-slate-900 p-6 rounded-[2.5rem] shadow-[6px_6px_0_0_#10b981] group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl border-2 border-slate-900 flex items-center justify-center text-white shadow-[4px_4px_0_0_#0f172a] group-hover:scale-110 transition-transform">
                            <ArrowUpRight size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Audit</p>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight italic">Siap Validasi</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <Card title="LAPORAN MASUK TERBARU">
                        <div className="flex flex-col gap-4">
                            {stats.recent_submissions.length > 0 ? (
                                stats.recent_submissions.slice(0, 5).map((report: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-white border-[3px] border-slate-900 rounded-[2rem] hover:bg-emerald-50/30 transition-all group shadow-sm">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-white border-[3px] border-slate-900 flex items-center justify-center font-black text-base shadow-[4px_4px_0_0_#0f172a] group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                                                {report.madrasah?.nama_madrasah?.substring(0, 2) || 'MI'}
                                            </div>
                                            <div>
                                                <p className="font-black text-lg text-slate-900 uppercase tracking-tighter italic leading-none mb-1">
                                                    {report.madrasah?.nama_madrasah}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                        <Clock size={12} className="text-emerald-500" />
                                                        {report.bulan_tahun ? new Date(report.bulan_tahun).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase() : '-'}
                                                    </p>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {report.madrasah?.kecamatan || 'WILAYAH -'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 uppercase tracking-widest shadow-sm
                                                ${report.status_laporan === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    report.status_laporan === 'revisi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                {report.status_laporan === 'verified' ? 'TERVERIFIKASI' : report.status_laporan === 'revisi' ? 'REVISI' : 'DI PROSES'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center border-[3px] border-dashed border-slate-200 rounded-[2rem]">
                                    <p className="font-black text-slate-300 uppercase tracking-[0.2em] italic">Belum ada laporan masuk</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <Card title="PANDUAN KERJA">
                        <div className="flex flex-col gap-6">
                            <div className="bg-emerald-50 border-[3px] border-slate-900 p-8 rounded-[2.5rem] shadow-[6px_6px_0_0_#10b981] relative overflow-hidden">
                                <FileClock className="absolute -right-6 -bottom-6 text-emerald-100 transition-transform duration-500" size={140} />

                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white rounded-2xl border-[3px] border-slate-900 flex items-center justify-center text-emerald-600 shadow-[4px_4px_0_0_#0f172a] mb-6">
                                        <Megaphone size={28} />
                                    </div>

                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-tight">Prosedur<br />Audit Laporan</h4>
                                    <p className="text-xs font-bold text-slate-500 mt-4 leading-relaxed">
                                        Verifikasi data Siswa, Guru, dan Sarpras wajib disesuaikan dengan database EMIS Pusat sebelum validasi akhir.
                                    </p>

                                    <div className="mt-8 pt-6 border-t-2 border-emerald-100 space-y-3">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Cek Kelengkapan Berkas
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Validasi Nominal Siswa
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Approval Laporan Bulanan
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full mt-8 bg-slate-900 text-white shadow-[6px_6px_0_0_#0f172a20] border-[3px] border-slate-900 !py-5 font-black uppercase tracking-widest text-[11px] rounded-[1.5rem]"
                                        onClick={() => window.location.href = '/staff/laporan'}
                                    >
                                        MULAI VERIFIKASI SEKARANG
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white border-[3px] border-slate-900 p-6 rounded-[2rem] shadow-[6px_6px_0_0_#f1f5f9]">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Butuh Bantuan?</p>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                                    Hubungi Tim IT Kemenag jika terjadi kendala pada sinkronisasi data madrasah.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ label, value, icon, color }: any) {
    const theme: any = {
        blue: "shadow-blue-600 bg-blue-50/50 border-slate-900 text-blue-700",
        amber: "shadow-amber-500 bg-amber-50/50 border-slate-900 text-amber-700",
        emerald: "shadow-emerald-500 bg-emerald-50/50 border-slate-900 text-emerald-700",
    };

    return (
        <div className={`p-6 rounded-[2.5rem] border-[3px] shadow-[6px_6px_0_0_#0f172a] ${theme[color]} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 text-slate-900">
                {React.cloneElement(icon as any, { size: 100 })}
            </div>
            <div className="relative z-10">
                <div className="mb-4 inline-block bg-white p-3 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a]">{icon}</div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60 text-slate-500">{label}</p>
                <p className="text-3xl font-black tracking-tighter italic leading-none text-slate-900">{value}</p>
            </div>
        </div>
    );
}
