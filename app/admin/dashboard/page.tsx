'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { FileCheck, FileClock, FileWarning, School, Loader2, TrendingUp, MapPin, Send, Trash2, Megaphone } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [announcementForm, setAnnouncementForm] = useState({ judul: '', isi: '' });

    const [stats, setStats] = useState<any>({
        total_madrasah: 0,
        laporan_masuk: 0,
        terverifikasi: 0,
        perlu_revisi: 0,
        recent_submissions: [],
        kecamatan_progress: []
    });

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            // Fetch Stats
            const response = await api.admin.getStats();
            const data = await response.json();
            if (response.ok) {
                const d = data.data || data;
                setStats({
                    total_madrasah: d.total_madrasah || 0,
                    laporan_masuk: d.laporan_masuk || 0,
                    terverifikasi: d.terverifikasi || 0,
                    perlu_revisi: d.perlu_revisi || 0,
                    recent_submissions: d.recent_submissions || [],
                    kecamatan_progress: d.kecamatan_progress || []
                });
            }

            // Fetch Announcements
            const annResponse = await api.master.getPengumuman();
            const annData = await annResponse.json();
            if (annResponse.ok) {
                setAnnouncements(annData.data || annData);
            }

        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAnnouncement = async () => {
        if (!announcementForm.judul || !announcementForm.isi) return alert('Mohon lengkapi judul dan isi pengumuman');

        setIsSubmitting(true);
        try {
            const response = await api.admin.createPengumuman({
                judul: announcementForm.judul,
                isi_info: announcementForm.isi,
                target_role: 'operator'
            });

            if (response.ok) {
                setAnnouncementForm({ judul: '', isi: '' });
                fetchStats(); // Refresh data
                alert('Pengumuman berhasil diterbitkan!');
            } else {
                alert('Gagal membuat pengumuman');
            }
        } catch (error) {
            alert('Terjadi kesalahan saat membuat pengumuman');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAnnouncement = async (id: number) => {
        if (!confirm('Hapus pengumuman ini?')) return;
        try {
            const response = await api.admin.deletePengumuman(id);
            if (response.ok) fetchStats();
        } catch (error) {
            alert('Gagal menghapus');
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Loader2 className="animate-spin text-emerald-700" size={64} />
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Memuat Statistik Real-time...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-slate-900 italic">Dashboard Monitoring</h1>
                    <p className="text-muted text-sm uppercase mt-2">Overview status laporan madrasah seluruh kabupaten.</p>
                </div>
                <div className="flex items-center gap-4 bg-white border-2 border-slate-900 px-6 py-3 rounded-2xl shadow-[4px_4px_0_0_#0f172a]">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Update Terakhir</p>
                        <p className="text-xs font-black text-slate-900 uppercase">Hari ini, {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <StatsCard
                    label="Total Madrasah"
                    value={stats.total_madrasah}
                    icon={<School size={32} />}
                    color="blue"
                />
                <StatsCard
                    label="Laporan Masuk"
                    value={stats.laporan_masuk}
                    icon={<FileClock size={32} />}
                    color="amber"
                />
                <StatsCard
                    label="Terverifikasi"
                    value={stats.terverifikasi}
                    icon={<FileCheck size={32} />}
                    color="emerald"
                />
                <StatsCard
                    label="Pengumuman"
                    value={announcements.length}
                    icon={<Megaphone size={32} />}
                    color="blue"
                />
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                    <Card title="LAPORAN TERBARU MASUK" className="h-full">
                        <div className="space-y-6">
                            {stats.recent_submissions.length > 0 ? (
                                stats.recent_submissions.map((report: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-6 hover:bg-slate-50 rounded-[2rem] transition-all border-b-2 border-slate-50 last:border-0 group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black text-xs group-hover:bg-slate-50 transition-colors uppercase italic shadow-[4px_4px_0_0_#0f172a] shrink-0 aspect-square">
                                                {report.madrasah?.nama_madrasah?.substring(0, 2) || 'MI'}
                                            </div>
                                            <div>
                                                <p className="font-black text-xl text-slate-900 tracking-tighter uppercase leading-none mb-2">
                                                    {report.madrasah?.nama_madrasah}
                                                </p>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                                                    <MapPin size={12} />
                                                    {report.madrasah?.kecamatan || 'Lokasi tidak tersedia'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-4 py-2 rounded-full text-[11px] font-black border uppercase tracking-widest
                                                ${report.status_laporan === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    report.status_laporan === 'revisi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                {report.status_laporan}
                                            </span>
                                            <p className="text-[11px] font-black text-slate-300 mt-2 uppercase tracking-widest">
                                                {new Date(report.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center font-black text-slate-300 uppercase italic opacity-30 tracking-widest text-xl">Belum ada laporan masuk.</div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-7">
                    <Card title="BUAT PENGUMUMAN" className="h-full">
                        {/* Form Input */}
                        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-4">
                            <Input
                                label="Judul Pengumuman"
                                placeholder="Contoh: Jadwal Pelaporan Bulan Februari"
                                value={announcementForm.judul}
                                onChange={(e) => setAnnouncementForm({ ...announcementForm, judul: e.target.value })}
                            />
                            {/* Textarea custom */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Isi Pengumuman</label>
                                <textarea
                                    className="w-full min-h-[120px] p-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-slate-300 resize-none"
                                    placeholder="Tulis informasi penting untuk operator madrasah..."
                                    value={announcementForm.isi}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, isi: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    className="px-8 bg-slate-900 shadow-xl"
                                    onClick={handleCreateAnnouncement}
                                    isLoading={isSubmitting}
                                    icon={<Send size={18} />}
                                >
                                    TERBITKAN
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Full Width History Section */}
                <div className="lg:col-span-12">
                    <Card title="RIWAYAT PENGUMUMAN">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.length > 0 ? (
                                announcements.map((item: any) => (
                                    <div key={item.id} className="bg-white border-2 border-slate-100 p-6 rounded-[2rem] hover:border-emerald-400 transition-colors group relative flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-black text-lg text-slate-900 uppercase italic leading-tight line-clamp-2">{item.judul}</h4>
                                                <button
                                                    onClick={() => handleDeleteAnnouncement(item.id)}
                                                    className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all shrink-0"
                                                    title="Hapus Pengumuman"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <p className="text-slate-500 text-sm font-bold leading-relaxed mb-6 line-clamp-3">{item.isi_info}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-widest pt-4 border-t-2 border-slate-50">
                                            <span className="flex items-center gap-1.5 text-emerald-600">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                                    <p className="text-slate-300 font-black text-base uppercase italic tracking-widest opacity-50">Belum ada pengumuman aktif</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ label, value, subValue, icon, color }: any) {
    const variants: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-200",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
        amber: "text-amber-600 bg-amber-50 border-amber-200",
        rose: "text-rose-600 bg-rose-50 border-rose-200",
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0_0_#0f172a] relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-slate-400 text-[10px] font-black mb-3 uppercase tracking-[0.2em]">{label}</p>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter italic">{value}</h3>
                {subValue && (
                    <div className="mt-6 inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">
                        <TrendingUp size={12} />
                        {subValue}
                    </div>
                )}
            </div>
            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${variants[color]}`}>
                {icon}
            </div>
        </div>
    );
}
