'use client';

import React, { useState, useEffect, use } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Users, Building, Coins, Loader2, Calendar, ShieldCheck, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function KasiDetailLaporanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('siswa');

    const tabs = [
        { id: 'siswa', label: '1. Siswa', icon: <Users size={18} /> },
        { id: 'guru', label: '2. Guru/Pegawai', icon: <Users size={18} /> },
        { id: 'sarpras', label: '3. Sarpras', icon: <Building size={18} /> },
        { id: 'keuangan', label: '4. Keuangan', icon: <Coins size={18} /> },
    ];

    const fetchDetail = async () => {
        setIsLoading(true);
        try {
            const response = await api.operator.getLaporanDetail(id);
            const data = await response.json();
            if (response.ok) {
                setReportData(data);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const formatBulan = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Loader2 className="animate-spin text-emerald-700" size={64} />
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm italic text-center">Menarik Data dari Server...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header Monitoring */}
            <div className="bg-white border-[3px] border-slate-900 p-8 sticky top-20 z-20 shadow-[6px_6px_0_0_#0f172a] rounded-[2rem] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="flex items-center gap-5 w-full xl:w-auto">
                    <Link href="/admin/laporan">
                        <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl border-2 hover:bg-slate-50">
                            <ArrowLeft size={24} />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border-2 uppercase tracking-widest
                                ${reportData?.status_laporan === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    reportData?.status_laporan === 'revisi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                        'bg-amber-100 text-amber-900 border-amber-300'}`}>
                                {reportData?.status_laporan}
                            </span>
                            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <ShieldCheck size={12} /> MODE MONITORING PIMPINAN
                            </span>
                        </div>
                        <h2 className="leading-none mb-1 text-2xl font-black italic">
                            {reportData?.madrasah?.nama_madrasah || 'MADRASAH'}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            PERIODE MONITORING: {formatBulan(reportData?.bulan_tahun)}
                        </p>
                    </div>
                </div>

                <div className="hidden xl:flex items-center gap-4 bg-emerald-50 px-6 py-4 rounded-2xl border-2 border-emerald-100 italic">
                    <Info size={20} className="text-emerald-600" />
                    <p className="text-xs font-bold text-emerald-800">
                        Anda berada dalam mode tinjau pimpinan. Validasi dilakukan oleh Staf Penmad.
                    </p>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    {/* Data Tabs */}
                    <div className="flex overflow-x-auto pb-2 gap-4 no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all shrink-0 border-2
                                    ${activeTab === tab.id
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl translate-y-[-2px]'
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <Card className="min-h-[400px]">
                        {activeTab === 'siswa' && <TableDataSiswa data={reportData?.siswa} />}
                        {activeTab === 'guru' && <TableDataGuru data={reportData?.guru} />}
                        {activeTab === 'sarpras' && <TableDataSarpras sarpras={reportData?.sarpras} />}
                        {activeTab === 'keuangan' && <TableDataKeuangan data={reportData?.keuangan} />}
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card title="CATATAN VALIDATOR">
                        <div className="p-6 bg-slate-100 border-2 border-slate-200 rounded-3xl min-h-[150px]">
                            <p className="text-sm font-bold text-slate-500 italic">
                                {reportData?.catatan_revisi || 'Tidak ada catatan revisi untuk periode ini.'}
                            </p>
                        </div>
                    </Card>

                    <Card title="DATA IDENTITAS">
                        <div className="space-y-4 font-bold text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-400 uppercase text-[10px]">NPSN</span>
                                <span className="text-slate-900">{reportData?.madrasah?.npsn}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-400 uppercase text-[10px]">Kecamatan</span>
                                <span className="text-slate-900 uppercase">{reportData?.madrasah?.kecamatan}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 uppercase text-[10px]">Tgl Submit</span>
                                <span className="text-slate-900">
                                    {reportData?.submitted_at ? new Date(reportData.submitted_at).toLocaleDateString('id-ID') : '-'}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Inner Components for Tables
function TableDataSiswa({ data }: any) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm font-bold border-collapse">
                <thead>
                    <tr className="bg-slate-900 text-white">
                        <th className="p-4 rounded-tl-2xl">KELAS</th>
                        <th className="p-4 text-center">ROMBEL</th>
                        <th className="p-4 text-emerald-400 text-center">LK</th>
                        <th className="p-4 text-rose-400 text-center">PR</th>
                        <th className="p-4 rounded-tr-2xl text-center">TOTAL</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 text-center">
                    {data?.map((s: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-black text-slate-900 border-x-2 border-slate-50">{s.kelas}</td>
                            <td className="p-5 border-x-2 border-slate-50">{s.jumlah_rombel}</td>
                            <td className="p-5 text-emerald-600 border-x-2 border-slate-50">{s.jumlah_lk}</td>
                            <td className="p-5 text-rose-600 border-x-2 border-slate-50">{s.jumlah_pr}</td>
                            <td className="p-5 font-black text-slate-900 bg-slate-50">{s.jumlah_lk + s.jumlah_pr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableDataGuru({ data }: any) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm font-bold border-collapse">
                <thead>
                    <tr className="bg-slate-900 text-white">
                        <th className="p-4 rounded-tl-2xl">NAMA GURU</th>
                        <th className="p-4">NIP/NIK</th>
                        <th className="p-4 text-center">L/P</th>
                        <th className="p-4 rounded-tr-2xl">JABATAN</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                    {data?.map((g: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-black text-slate-900 border-x-2 border-slate-50">{g.nama_guru}</td>
                            <td className="p-5 text-slate-400 font-mono border-x-2 border-slate-50">{g.nip_nik}</td>
                            <td className="p-5 text-center border-x-2 border-slate-50">{g.lp}</td>
                            <td className="p-5 uppercase text-[11px] border-x-2 border-slate-50">{g.jabatan}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableDataSarpras({ sarpras }: any) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm font-bold border-collapse">
                <thead>
                    <tr className="bg-slate-900 text-white">
                        <th className="p-4 rounded-tl-2xl">JENIS ASET</th>
                        <th className="p-4">LUAS</th>
                        <th className="p-4 text-center">BAIK</th>
                        <th className="p-4 text-center">RUSAK</th>
                        <th className="p-4 rounded-tr-2xl text-center">TOTAL</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                    {sarpras?.map((s: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-black text-slate-900 border-x-2 border-slate-50">{s.jenis_aset}</td>
                            <td className="p-5 font-mono text-slate-400 border-x-2 border-slate-50">{s.luas}</td>
                            <td className="p-5 text-center text-emerald-600 border-x-2 border-slate-50">{s.kondisi_baik}</td>
                            <td className="p-5 text-center text-rose-600 border-x-2 border-slate-50">{s.kondisi_rusak_berat}</td>
                            <td className="p-5 text-center bg-slate-50">{s.kondisi_baik + s.kondisi_rusak_berat}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TableDataKeuangan({ data }: any) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm font-bold border-collapse">
                <thead>
                    <tr className="bg-slate-900 text-white">
                        <th className="p-4 rounded-tl-2xl">URAIAN KEGIATAN</th>
                        <th className="p-4 text-center">VOLUME</th>
                        <th className="p-4 text-center">SATUAN</th>
                        <th className="p-4 rounded-tr-2xl text-right">TOTAL BIAYA (RP)</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 italic font-black">
                    {data?.map((k: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 text-slate-900 uppercase tracking-tighter border-x-2 border-slate-50">{k.uraian_kegiatan}</td>
                            <td className="p-5 text-center border-x-2 border-slate-50">{k.volume}</td>
                            <td className="p-5 text-center uppercase text-[10px] border-x-2 border-slate-50">{k.satuan}</td>
                            <td className="p-5 text-right font-mono text-emerald-700 bg-slate-50">
                                {Number(k.volume * k.harga_satuan).toLocaleString('id-ID')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
