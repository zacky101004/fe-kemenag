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
                        <colgroup>
                            <col style={{ width: '38%' }} />
                            <col style={{ width: '22%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                        </colgroup>
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-6 border-b-2 border-slate-300 text-left">Madrasah &amp; Lokasi</th>
                                <th className="px-6 py-6 border-b-2 border-slate-300 text-left">Periode Laporan</th>
                                <th className="px-6 py-6 border-b-2 border-slate-300 text-left">Status Terkini</th>
                                <th className="px-6 py-6 border-b-2 border-slate-300 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <Loader2 className="animate-spin mx-auto text-emerald-600 mb-4" size={48} />
                                        <p className="font-black text-slate-300 uppercase tracking-widest italic">Menghubungkan Radar Monitoring...</p>
                                    </td>
                                </tr>
                            ) : submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <p className="font-black text-slate-300 uppercase tracking-widest italic opacity-40 text-xl">Belum ada laporan masuk</p>
                                    </td>
                                </tr>
                            ) : submissions.map((item) => (
                                <tr key={item.id_laporan} className="group hover:bg-slate-50 transition-colors">

                                    {/* Kolom 1: Madrasah & Lokasi */}
                                    <td className="px-6 py-5 text-left align-middle">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border-[3px] border-slate-900 flex items-center justify-center font-black text-sm shadow-[4px_4px_0_0_#0f172a] group-hover:bg-emerald-50 transition-colors shrink-0">
                                                {item.madrasah?.nama_madrasah?.substring(0, 2) || 'MI'}
                                            </div>
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="font-black text-slate-900 text-sm uppercase leading-tight tracking-tighter">
                                                    {item.madrasah?.nama_madrasah}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 leading-none">
                                                    <MapPin size={11} className="text-emerald-600 shrink-0" />
                                                    {item.madrasah?.kecamatan || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom 2: Periode Laporan */}
                                    <td className="px-6 py-5 text-left align-middle">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className="font-black text-slate-900 text-sm uppercase leading-tight">
                                                {formatBulan(item.bulan_tahun)}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 leading-none">
                                                <Clock size={11} className="text-emerald-600 shrink-0" />
                                                {item.submitted_at
                                                    ? new Date(item.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                                    : 'Belum Submit'}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Kolom 3: Status */}
                                    <td className="px-6 py-5 text-left align-middle">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black border-2 uppercase tracking-widest
                                            ${item.status_laporan === 'verified'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : item.status_laporan === 'revisi'
                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            {item.status_laporan === 'verified' ? <CheckCircle size={14} />
                                                : item.status_laporan === 'revisi' ? <XCircle size={14} />
                                                    : <Clock size={14} />}
                                            {item.status_laporan}
                                        </span>
                                    </td>

                                    {/* Kolom 4: Aksi */}
                                    <td className="px-6 py-5 text-left align-middle">
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
