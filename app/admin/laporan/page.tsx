'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Loader2,
    MapPin
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function KasiLaporanPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [submissions, setSubmissions] = useState<any[]>([]);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const response = await api.admin.getLaporan({ trashed: 0 });
            const data = await response.json();
            if (response.ok) {
                setSubmissions(data.data || data);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const formatBulan = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    return (
        <div className="space-y-6 animate-fade-in -mt-6">


            <Card>
                <div className="overflow-x-auto -mx-10 px-10">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-6 border-b-2 border-slate-300">Madrasah & Lokasi</th>
                                <th className="px-6 py-6 border-b-2 border-slate-300">Periode Laporan</th>
                                <th className="px-6 py-6 border-b-2 border-slate-300">Status Terkini</th>
                                <th className="px-6 py-6 border-b-2 border-slate-300">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-emerald-600 mb-4" size={48} />
                                        <p className="font-black text-slate-300 uppercase tracking-widest italic text-center">Menghubungkan Radar Monitoring...</p>
                                    </td>
                                </tr>
                            ) : submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <p className="font-black text-slate-300 uppercase tracking-widest italic opacity-40 text-xl text-center">Belum ada laporan masuk</p>
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((item) => (
                                    <tr key={item.id_laporan} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-8 text-center">
                                            <div className="inline-flex items-center gap-4 text-left">
                                                <div className="w-14 h-14 rounded-2xl bg-white border-[3px] border-slate-900 flex items-center justify-center font-black italic text-lg shadow-[4px_4px_0_0_#0f172a] group-hover:bg-emerald-50 transition-colors shrink-0">
                                                    {item.madrasah?.nama_madrasah?.substring(0, 2) || 'MI'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 text-base uppercase leading-tight mb-1 tracking-tighter italic">
                                                        {item.madrasah?.nama_madrasah}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 leading-none">
                                                        <MapPin size={12} className="text-emerald-600" />
                                                        {item.madrasah?.kecamatan || 'Kecamatan -'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="font-black text-slate-900 text-sm italic mb-1 uppercase">{formatBulan(item.bulan_tahun)}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 leading-none">
                                                    <Clock size={12} className="text-emerald-600" />
                                                    {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Belum Submit'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-10">
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black border-2 uppercase tracking-widest
                                                ${item.status_laporan === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    item.status_laporan === 'revisi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                {item.status_laporan === 'verified' ? <CheckCircle size={14} /> :
                                                    item.status_laporan === 'revisi' ? <XCircle size={14} /> :
                                                        <Clock size={14} />}
                                                {item.status_laporan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-10">
                                            <Link href={`/admin/laporan/${item.id_laporan}`}>
                                                <Button
                                                    variant="outline"
                                                    icon={<Eye size={18} />}
                                                    className="!text-[10px] !font-black !tracking-widest uppercase border-2 shadow-sm"
                                                >
                                                    LIHAT DETAIL
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
