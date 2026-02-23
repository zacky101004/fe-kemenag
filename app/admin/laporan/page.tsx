'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Eye, Search, Loader2, Calendar, Trash2, RotateCcw, Archive, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminLaporanPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [isLoading, setIsLoading] = useState(true);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [showTrashed, setShowTrashed] = useState(false);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const response = await api.admin.getLaporan({ trashed: showTrashed ? 1 : 0 });
            const data = await response.json();
            if (response.ok) {
                setSubmissions(data.data || data);
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [showTrashed]);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(sub => {
            const schoolName = sub.madrasah?.nama_madrasah || '';
            const nsm = sub.madrasah?.npsn || '';
            const status = sub.status_laporan || '';

            const matchesSearch = schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                nsm.includes(searchQuery);

            const matchesStatus = statusFilter === 'Semua Status' ||
                status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, submissions]);

    const formatBulan = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-slate-900 italic">
                        Validasi Laporan {showTrashed && '(TEMPAT SAMPAH)'}
                    </h1>
                    <p className="text-muted text-sm uppercase mt-2 pl-2">
                        Daftar masuk laporan madrasah
                    </p>
                </div>
                <Button
                    variant={showTrashed ? 'primary' : 'outline'}
                    icon={<Trash2 size={20} />}
                    onClick={() => setShowTrashed(!showTrashed)}
                >
                    {showTrashed ? 'TAMPIL DATA' : 'TEMPAT SAMPAH'}
                </Button>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row gap-8 mb-12 items-end">
                    <div className="flex-1">
                        <Input
                            label="Cari Madrasah"
                            placeholder="Nama sekolah atau NPSN..."
                            icon={<Search size={22} />}
                            className="mb-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-72 relative">
                        <label className="input-label">Filter Status Laporan</label>
                        <div className="relative">
                            <select
                                className="select-field appearance-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="Semua Status">Semua Status</option>
                                <option value="submitted">MENUNGGU VALIDASI</option>
                                <option value="revisi">REVISI</option>
                                <option value="verified">DISETUJUI</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={20} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-container relative min-h-[400px]">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 transition-all">
                            <Loader2 className="animate-spin text-emerald-700" size={64} />
                        </div>
                    )}

                    <table>
                        <thead>
                            <tr>
                                <th>MADRASAH</th>
                                <th>BULAN LAPORAN</th>
                                <th>TANGGAL KIRIM</th>
                                <th>STATUS</th>
                                <th className="text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubmissions.map((item) => (
                                <tr key={item.id_laporan} className="group">
                                    <td className="text-left">
                                        <div className="font-black text-slate-900 text-lg uppercase tracking-tighter group-hover:text-emerald-700 transition-colors">
                                            {item.madrasah?.nama_madrasah ?? 'MADRASAH'}
                                        </div>
                                        <div className="text-[11px] font-black text-slate-400 mt-1 uppercase tracking-widest leading-none">
                                            NPSN / NSM: {item.madrasah?.npsn ?? '-'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="inline-flex items-center gap-2 font-black text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl text-[11px] uppercase whitespace-nowrap">
                                            <Calendar size={14} className="text-slate-400" />
                                            {formatBulan(item.bulan_tahun)}
                                        </div>
                                    </td>
                                    <td className="text-slate-400 font-bold text-sm">
                                        {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                    </td>
                                    <td>
                                        <span className={`px-5 py-2.5 rounded-xl font-black text-[11px] border-2 uppercase tracking-[0.1em] shadow-sm inline-block
                                            ${item.status_laporan === 'submitted' ? 'bg-amber-100 text-amber-900 border-amber-400' :
                                                item.status_laporan === 'revisi' ? 'bg-rose-100 text-rose-900 border-rose-400' :
                                                    item.status_laporan === 'verified' ? 'bg-emerald-100 text-emerald-900 border-emerald-400' :
                                                        'bg-slate-100 text-slate-900 border-slate-400'
                                            }`}
                                        >
                                            {item.status_laporan === 'submitted' ? 'MENUNGGU' :
                                                item.status_laporan === 'revisi' ? 'REVISI' :
                                                    item.status_laporan === 'verified' ? 'DISETUJUI' :
                                                        item.status_laporan}
                                        </span>
                                    </td>
                                    <td className="text-right py-4">
                                        <div className="flex flex-col items-end gap-2">
                                            {!showTrashed ? (
                                                <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                                                    <Link href={`/admin/laporan/${item.id_laporan}`} className="w-full">
                                                        <Button
                                                            variant="primary"
                                                            className="w-full !px-0 !py-2 !text-[10px] !font-black !tracking-wider"
                                                        >
                                                            VALIDASI
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full !px-0 !py-2 !text-rose-500 !border-rose-200 hover:!bg-rose-50 !text-[10px] !font-black"
                                                        icon={<Trash2 size={14} />}
                                                        onClick={async () => {
                                                            if (item.status_laporan !== 'verified') {
                                                                alert('Laporan harus di-approve atau reject (revisi) terlebih dahulu sebelum bisa dihapus.');
                                                                return;
                                                            }
                                                            if (confirm('Pindahkan ke tempat sampah?')) {
                                                                try {
                                                                    const res = await api.admin.deleteLaporan(item.id_laporan);
                                                                    if (res.ok) fetchSubmissions();
                                                                } catch (e) { alert('Kesalahan koneksi'); }
                                                            }
                                                        }}
                                                        disabled={item.status_laporan !== 'verified'}
                                                    >
                                                        HAPUS
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1.5 w-full max-w-[120px]">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full !px-0 !py-2 !bg-emerald-50 !text-emerald-700 !border-emerald-200 !text-[10px] !font-black"
                                                        icon={<RotateCcw size={14} />}
                                                        onClick={async () => {
                                                            if (confirm('Restore laporan?')) {
                                                                try {
                                                                    const res = await api.admin.restoreLaporan(item.id_laporan);
                                                                    if (res.ok) fetchSubmissions();
                                                                } catch (e) { alert('Kesalahan koneksi'); }
                                                            }
                                                        }}
                                                    >
                                                        RESTORE
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        className="w-full !px-0 !py-2 !text-[10px] !font-black"
                                                        icon={<Trash2 size={14} />}
                                                        onClick={async () => {
                                                            if (confirm('Hapus permanen?')) {
                                                                try {
                                                                    const res = await api.admin.permanentDeleteLaporan(item.id_laporan);
                                                                    if (res.ok) fetchSubmissions();
                                                                } catch (e) { alert('Kesalahan koneksi'); }
                                                            }
                                                        }}
                                                    >
                                                        HAPUS
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!isLoading && filteredSubmissions.length === 0 && (
                        <div className="py-40 text-center text-slate-300 font-extrabold text-2xl uppercase italic opacity-30 tracking-widest">
                            {showTrashed ? 'Tempat Sampah Kosong.' : 'Daftar Kosong.'}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
