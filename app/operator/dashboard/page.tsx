'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Bell, Calendar, FileText, Users, School, Loader2, Sparkles, TrendingUp, Info } from 'lucide-react';
import { api } from '@/lib/api';

export default function OperatorDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>({
        last_report_status: 'BELUM ADA',
        total_siswa: 0,
        total_guru: 0,
        announcements: []
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [dashRes, announceRes] = await Promise.all([
                api.operator.getDashboard(),
                api.master.getPengumuman()
            ]);

            const dashData = await dashRes.json();
            const announceData = await announceRes.json();

            if (dashRes.ok) {
                const d = dashData.data || dashData;
                setDashboardData((prev: any) => ({
                    ...prev,
                    last_report_status: d[0]?.status_laporan || 'BELUM ADA',
                    total_siswa: d.total_siswa || 0,
                    total_guru: d.total_guru || 0,
                }));
            }

            if (announceRes.ok) {
                setDashboardData((prev: any) => ({
                    ...prev,
                    announcements: announceData.data || announceData
                }));
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Loader2 className="animate-spin text-emerald-700" size={64} />
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm text-center">Sinkronisasi Data Madrasah...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-slate-900 italic">Beranda Operator</h1>
                    <p className="text-muted text-sm uppercase mt-2">Pantau status laporan dan informasi terbaru madrasah anda.</p>
                </div>
                <div className="flex items-center gap-4 bg-white border-2 border-slate-900 px-6 py-3 rounded-2xl shadow-[4px_4px_0_0_#0f172a]">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Sistem</p>
                        <p className="text-xs font-black text-slate-900 uppercase">Online & Tersinkron</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid: Status + Latest Announcement */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Status Laporan - Left Side (1 column) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0_0_#0f172a]">
                        <div className="flex flex-col items-center text-center gap-6 w-full">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border-2 border-emerald-200">
                                <FileText size={32} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-3">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Status Laporan</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{dashboardData.last_report_status}</h3>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <TrendingUp size={12} className="text-emerald-500" />
                                    Terakhir disubmit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Announcement - Right Side (2 columns) */}
                <div className="lg:col-span-2">
                    {dashboardData.announcements.length > 0 ? (
                        <div className="bg-white p-8 rounded-[3rem] border-[3px] border-slate-900 shadow-[8px_8px_0_0_#0f172a] h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <span className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                                    PAPAN PENGUMUMAN
                                </span>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                    {dashboardData.announcements.length} INFO
                                </div>
                            </div>

                            <div className="overflow-y-auto pr-2 space-y-6 max-h-[400px] custom-scrollbar">
                                {dashboardData.announcements.map((announcement: any, index: number) => (
                                    <div key={index} className="group relative border-b-2 border-slate-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-center gap-3 text-emerald-600 font-black uppercase text-[10px] tracking-widest mb-2">
                                            <Calendar size={14} />
                                            {new Date(announcement.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            {index === 0 && <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[9px] animate-pulse ml-2">TERBARU</span>}
                                        </div>

                                        <h4 className="font-black text-xl mb-3 text-slate-900 tracking-tighter uppercase italic leading-tight group-hover:text-emerald-600 transition-colors">
                                            {announcement.judul}
                                        </h4>

                                        <div className="text-slate-500 text-sm font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 italic">
                                            <div className="flex gap-3">
                                                <Info className="shrink-0 text-slate-300 mt-0.5" size={16} />
                                                <span>{announcement.isi_info}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-200 h-full flex items-center justify-center">
                            <p className="text-slate-300 font-black text-2xl uppercase italic tracking-widest opacity-30">Belum ada pengumuman</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color, subText }: any) {
    const variants: any = {
        emerald: "border-emerald-600 bg-emerald-50 text-emerald-800",
        amber: "border-amber-600 bg-amber-50 text-amber-800",
        blue: "border-blue-600 bg-blue-50 text-blue-800"
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0_0_#0f172a] group hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter italic leading-none">{value}</h3>
                </div>
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border-2 border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                    {icon}
                </div>
            </div>
            <div className="pt-6 border-t-2 border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp size={14} className="text-emerald-500" />
                    {subText}
                </p>
            </div>
        </div>
    );
}
