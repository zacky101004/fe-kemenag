'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, ArrowLeft, School, Users, Building, Coins, Loader2, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminLaporanVerifyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('siswa');
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [catatanRevisi, setCatatanRevisi] = useState('');

    const tabs = [
        { id: 'siswa', label: '1. Siswa', icon: <Users size={18} /> },
        { id: 'rekap_personal', label: '2. Rekap Personal', icon: <Users size={18} /> },
        { id: 'guru', label: '3. Guru/TU', icon: <Users size={18} /> },
        { id: 'sarpras_mobiler', label: '4. Sarpras & Mobiler', icon: <Building size={18} /> },
        { id: 'keuangan', label: '5. Keuangan', icon: <Coins size={18} /> },
    ];

    const fetchDetail = async () => {
        setIsLoading(true);
        try {
            const response = await api.operator.getLaporanDetail(id);
            const data = await response.json();
            if (response.ok) {
                setReportData(data.data || data);
                setCatatanRevisi(data.catatan_revisi || '');
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleAction = async (status: 'verified' | 'revisi') => {
        if (status === 'revisi' && !catatanRevisi.trim()) {
            alert('Harap berikan catatan revisi jika laporan dikembalikan.');
            return;
        }

        if (!confirm(`Apakah Anda yakin ingin ${status === 'verified' ? 'MENERIMA' : 'MENGEMBALIKAN'} laporan ini?`)) return;

        setIsProcessing(true);
        try {
            const res = await api.admin.verifyLaporan(Number(id), {
                status_laporan: status,
                catatan_revisi: status === 'revisi' ? catatanRevisi : null
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || (status === 'verified' ? 'Laporan Berhasil Disetujui' : 'Laporan Berhasil Dikembalikan untuk Revisi'));
                router.push('/admin/laporan');
                setTimeout(() => {
                    router.refresh();
                }, 100);
            } else {
                alert(data.message || 'Gagal memproses laporan.');
            }
        } catch (error) {
            alert('Kesalahan koneksi atau server');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Loader2 className="animate-spin text-emerald-700" size={64} />
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Memuat Data Laporan...</p>
            </div>
        );
    }

    const formatBulan = (dateStr: string) => {
        if (!dateStr) return 'LAPORAN';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toUpperCase();
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Header Sticky yang lebih rapi */}
            <div className="bg-white border-[3px] border-slate-900 p-8 sticky top-20 z-20 shadow-[6px_6px_0_0_#0f172a] rounded-[2rem] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="flex items-center gap-5 w-full xl:w-auto">
                    <Link href="/admin/laporan">
                        <Button variant="outline" size="sm" className="!h-12 !w-12 !p-0 rounded-2xl">
                            <ArrowLeft size={24} />
                        </Button>
                    </Link>
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl border-2 border-emerald-200 flex items-center justify-center shrink-0">
                        <School className="text-emerald-700" size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest
                                ${reportData?.status_laporan === 'verified' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                                    reportData?.status_laporan === 'revisi' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                                        'bg-amber-100 text-amber-900 border-amber-300'}`}>
                                {reportData?.status_laporan}
                            </span>
                        </div>
                        <h2 className="leading-none mb-1">
                            {reportData?.madrasah?.nama_madrasah || 'MADRASAH'}
                        </h2>
                        <p className="text-muted text-[10px] uppercase tracking-widest">
                            PERIODE: {formatBulan(reportData?.bulan_tahun)}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row gap-4 w-full xl:w-auto">
                    <Button
                        variant="danger"
                        className="flex-1 xl:w-48"
                        icon={<XCircle size={18} />}
                        onClick={() => handleAction('revisi')}
                        isLoading={isProcessing}
                        disabled={reportData?.status_laporan === 'verified'}
                    >
                        REVISI
                    </Button>
                    <Button
                        className="flex-1 xl:w-48"
                        icon={<CheckCircle size={18} />}
                        onClick={() => handleAction('verified')}
                        isLoading={isProcessing}
                        disabled={reportData?.status_laporan === 'verified'}
                    >
                        SETUJU
                    </Button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    {/* Compact Custom Tabs */}
                    <div className="flex overflow-x-auto bg-slate-900 p-2 rounded-2xl gap-2 no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 font-black text-[10px] transition-all rounded-xl whitespace-nowrap uppercase tracking-widest
                                ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                {tab.icon && React.isValidElement(tab.icon) ? React.cloneElement(tab.icon as any, { size: 14 }) : tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Views */}
                    <div className="transition-all duration-300">
                        {activeTab === 'siswa' && <SiswaTable rows={reportData?.siswa} />}
                        {activeTab === 'rekap_personal' && <RekapPersonalTable rows={reportData?.rekap_personal} />}
                        {activeTab === 'guru' && <GuruTable rows={reportData?.guru} />}
                        {activeTab === 'sarpras_mobiler' && (
                            <div className="space-y-10">
                                <SarprasTable rows={reportData?.sarpras} />
                                <MobilerTable rows={reportData?.mobiler} />
                            </div>
                        )}
                        {activeTab === 'keuangan' && <KeuanganTable rows={reportData?.keuangan} />}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card title="REVISI & CATATAN">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-4">
                            Tuliskan instruksi perbaikan jika laporan dikembalikan ke operator.
                        </p>
                        <textarea
                            className="w-full p-6 text-sm font-bold border-2 border-slate-200 rounded-3xl focus:border-emerald-500 bg-slate-50/50 outline-none min-h-[180px] transition-all"
                            placeholder="Contoh: Lampiran data guru belum lengkap, mohon periksa tabel keuangan..."
                            value={catatanRevisi}
                            onChange={(e) => setCatatanRevisi(e.target.value)}
                            disabled={reportData?.status_laporan === 'verified'}
                        ></textarea>
                    </Card>

                    <Card title="DATA MADRASAH">
                        <div className="space-y-6">
                            <div className="group">
                                <label className="input-label">NPSN / NSM Sekolah</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-slate-900 group-hover:border-emerald-200 transition-colors">
                                    {reportData?.madrasah?.npsn || '-'}
                                </div>
                            </div>
                            <div className="group">
                                <label className="input-label">Alamat Lengkap</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 font-black text-slate-900 text-sm leading-relaxed group-hover:border-emerald-200 transition-colors">
                                    {reportData?.madrasah?.alamat || '-'}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// --- TABLE COMPONENTS (Read Only & Standardized) ---

function EmptyRow({ colSpan }: { colSpan: number }) {
    return (
        <tr>
            <td colSpan={colSpan} className="py-20 text-center text-slate-300 font-extrabold italic bg-slate-50/30 uppercase tracking-widest text-sm">
                Belum ada data tersedia.
            </td>
        </tr>
    );
}

const tableWrapper = "table-container !rounded-3xl";

function SiswaTable({ rows }: { rows: any[] }) {
    return (
        <Card title="Data Siswa (Section A)">
            <div className={tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th rowSpan={2}>KELAS</th>
                            <th rowSpan={2}>ROMBEL</th>
                            <th colSpan={2}>JUMLAH SISWA</th>
                            <th colSpan={2}>MUTASI</th>
                            <th rowSpan={2}>TOTAL</th>
                        </tr>
                        <tr>
                            <th>L</th>
                            <th>P</th>
                            <th>MASUK</th>
                            <th>KELUAR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows && rows.length > 0 ? rows.map((row, i) => (
                            <tr key={i}>
                                <td className="text-left px-8 font-black uppercase text-slate-900">{row.kelas}</td>
                                <td>{row.jumlah_rombel || 0}</td>
                                <td>{row.jumlah_lk || 0}</td>
                                <td>{row.jumlah_pr || 0}</td>
                                <td className="text-emerald-600">+{row.mutasi_masuk || 0}</td>
                                <td className="text-rose-600">-{row.mutasi_keluar || 0}</td>
                                <td className="bg-slate-50 font-black text-emerald-700">
                                    {(row.jumlah_lk || 0) + (row.jumlah_pr || 0) + (row.mutasi_masuk || 0) - (row.mutasi_keluar || 0)}
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7} />}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function RekapPersonalTable({ rows }: { rows: any[] }) {
    return (
        <Card title="Rekap Personal (Section B)">
            <div className={tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th rowSpan={2}>KEADAAN</th>
                            <th colSpan={2}>JUMLAH</th>
                            <th colSpan={2}>MUTASI</th>
                        </tr>
                        <tr>
                            <th>L</th>
                            <th>P</th>
                            <th>IN</th>
                            <th>OUT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows && rows.length > 0 ? rows.map((row, i) => (
                            <tr key={i}>
                                <td className="text-left px-8 font-black uppercase">{row.keadaan}</td>
                                <td>{row.jumlah_lk || 0}</td>
                                <td>{row.jumlah_pr || 0}</td>
                                <td>{row.mutasi_masuk || 0}</td>
                                <td>{row.mutasi_keluar || 0}</td>
                            </tr>
                        )) : <EmptyRow colSpan={5} />}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function GuruTable({ rows }: { rows: any[] }) {
    return (
        <Card title="Detail Guru & TU (Section F)">
            <div className={tableWrapper}>
                <table className="min-w-[1200px]">
                    <thead>
                        <tr>
                            <th>NAMA LENGKAP</th>
                            <th>NIP/NIK</th>
                            <th>L/P</th>
                            <th>PENDIDIKAN</th>
                            <th>STATUS</th>
                            <th>TUGAS</th>
                            <th>SERTIFIKASI</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows && rows.length > 0 ? rows.map((row, i) => (
                            <tr key={i}>
                                <td className="text-left px-8 font-black uppercase text-slate-900">{row.nama_guru}</td>
                                <td className="font-mono text-[11px] opacity-40">{row.nip_nik || '-'}</td>
                                <td className="text-sm">{row.lp}</td>
                                <td className="text-sm">{row.pendidikan_terakhir} {row.jurusan}</td>
                                <td className="text-sm uppercase">{row.status_pegawai}</td>
                                <td className="text-sm uppercase">{row.mata_pelajaran}</td>
                                <td>
                                    <span className={`px-4 py-2 rounded-full text-[11px] font-black border uppercase
                                        ${row.sertifikasi ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                        {row.sertifikasi ? 'SUDAH' : 'BELUM'}
                                    </span>
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={7} />}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function SarprasTable({ rows }: { rows: any[] }) {
    return (
        <Card title="Sarpras (Section C)">
            <div className={tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>JENIS ASET</th>
                            <th>LUAS</th>
                            <th>BAIK</th>
                            <th>RR</th>
                            <th>RB</th>
                            <th>REHAB</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows && rows.length > 0 ? rows.map((row, i) => (
                            <tr key={i}>
                                <td className="text-left px-8 font-black uppercase">{row.jenis_aset}</td>
                                <td>{row.luas || '-'}</td>
                                <td className="font-black text-slate-900">{row.kondisi_baik || 0}</td>
                                <td>{row.kondisi_rusak_ringan || 0}</td>
                                <td className="font-black text-slate-900">{row.kondisi_rusak_berat || 0}</td>
                                <td>{row.perlu_rehab || 0}</td>
                            </tr>
                        )) : <EmptyRow colSpan={6} />}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function MobilerTable({ rows }: { rows: any[] }) {
    return (
        <Card title="Data Mobiler">
            <div className={tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>NAMA BARANG</th>
                            <th>TOTAL</th>
                            <th>BAIK</th>
                            <th>RB</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows && rows.length > 0 ? rows.map((row, i) => (
                            <tr key={i}>
                                <td className="text-left px-8 font-black uppercase">{row.nama_barang}</td>
                                <td className="font-black">{row.jumlah_total || 0}</td>
                                <td>{row.kondisi_baik || 0}</td>
                                <td>{row.kondisi_rusak_berat || 0}</td>
                            </tr>
                        )) : <EmptyRow colSpan={4} />}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

function KeuanganTable({ rows }: { rows: any[] }) {
    const total = rows?.reduce((sum, r) => sum + (Number(r.volume || 0) * Number(r.harga_satuan || 0)), 0) || 0;
    return (
        <Card title="Keuangan (BOS/Non-BOS)">
            <div className={tableWrapper}>
                <table>
                    <thead>
                        <tr>
                            <th>URAIAN KEGIATAN</th>
                            <th>VOL</th>
                            <th>SAT</th>
                            <th>HARGA</th>
                            <th>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows && rows.length > 0 ? rows.map((row, i) => (
                            <tr key={i}>
                                <td className="text-left px-8 font-black uppercase text-slate-800">{row.uraian_kegiatan}</td>
                                <td className="text-sm">{row.volume || 0}</td>
                                <td className="text-[11px] uppercase opacity-50">{row.satuan || '-'}</td>
                                <td className="text-right font-mono text-sm">Rp {(row.harga_satuan || 0).toLocaleString('id-ID')}</td>
                                <td className="text-right font-black text-slate-900 italic">
                                    Rp {((row.volume || 0) * (row.harga_satuan || 0)).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        )) : <EmptyRow colSpan={5} />}
                    </tbody>
                    <tfoot>
                        <tr className="bg-white border-t-[3px] border-slate-900 border-b-0">
                            <td colSpan={4} className="p-8 text-right uppercase tracking-[0.2em] font-black text-sm text-slate-400">SUBTOTAL ANGGARAN BULAN INI</td>
                            <td className="p-8 text-right text-slate-900 text-4xl font-black italic">Rp {total.toLocaleString('id-ID')}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </Card>
    );
}
