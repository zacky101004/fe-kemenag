'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import {
    ArrowLeft,
    School as SchoolIcon,
    MapPin,
    Phone,
    Mail,
    User,
    Calendar,
    Award,
    CheckCircle2,
    XCircle,
    Loader2,
    Building2,
    Users
} from 'lucide-react';

export default function DetailMadrasahPage() {
    const params = useParams();
    const router = useRouter();
    const [school, setSchool] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const id = params?.id;

    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id]);

    const fetchDetail = async () => {
        try {
            const response = await api.master.getMadrasahById(id as string);
            if (response.ok) {
                const data = await response.json();
                setSchool(data);
            } else {
                alert('Gagal mengambil data madrasah');
                router.push('/admin/master/madrasah');
            }
        } catch (error) {
            alert('Terjadi kesalahan koneksi');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="animate-spin text-emerald-700" size={60} />
            </div>
        );
    }

    if (!school) return null;

    return (
        <div className="space-y-8 pb-10">
            {/* Header Navigation */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    icon={<ArrowLeft size={26} strokeWidth={3} className="text-slate-900" />}
                    className="w-12 h-12 p-0 rounded-xl border-2 border-slate-200 shadow-sm hover:border-emerald-500 hover:text-emerald-700 flex items-center justify-center bg-white"
                    onClick={() => router.back()}
                />
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Profil Madrasah</h1>
                    <p className="text-slate-500 font-bold text-sm">Detail data dan informasi sekolah</p>
                </div>
            </div>

            {/* Main Profile Header */}
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="w-32 h-32 bg-white border-4 border-slate-100 rounded-3xl flex items-center justify-center text-emerald-700 shadow-md shrink-0">
                        <SchoolIcon size={64} />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3">{school.nama_madrasah}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <div className="px-4 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-sm font-black tracking-wider">
                                    NPSN: {school.npsn}
                                </div>
                                <div className="px-4 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-sm font-black tracking-wider">
                                    NSM: {school.nsm || '-'}
                                </div>
                                <div className={`px-4 py-1.5 rounded-lg border text-sm font-black tracking-wider flex items-center gap-2 ${school.status_aktif == 1 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                    {school.status_aktif == 1 ? (
                                        <><CheckCircle2 size={16} /> AKTIF BEROPERASI</>
                                    ) : (
                                        <><XCircle size={16} /> NON-AKTIF</>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2">
                            <div className="flex items-center gap-2 text-slate-500 font-bold">
                                <MapPin size={18} />
                                <span className="uppercase">{school.alamat || 'Alamat tidak tersedia'}</span>
                            </div>
                            {(school.kecamatan || school.kabupaten) && (
                                <div className="flex items-center gap-2 text-slate-500 font-bold">
                                    <Building2 size={18} />
                                    <span className="uppercase">{school.kecamatan}, {school.kabupaten}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: School Details */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Informasi Akademik & Kelembagaan">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Award size={14} /> Akreditasi
                                </label>
                                <p className="text-xl font-bold text-slate-900">{school.akreditasi || 'Belum Terakreditasi'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Calendar size={14} /> Tahun Berdiri
                                </label>
                                <p className="text-xl font-bold text-slate-900">{school.tahun_berdiri || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <SchoolIcon size={14} /> Status Madrasah
                                </label>
                                <p className="text-xl font-bold text-slate-900 uppercase">{school.status_madrasah || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <MapPin size={14} /> Lokasi (Lat, Long)
                                </label>
                                <p className="text-base font-bold text-slate-900 font-mono">
                                    {school.latitude || '-'}, {school.longitude || '-'}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Kontak & Kepala Madrasah">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div className="col-span-1 md:col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-200 md:flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-full border-4 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
                                    <User size={32} />
                                </div>
                                <div className="text-center md:text-left">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Kepala Madrasah</label>
                                    <p className="text-xl font-black text-slate-900 uppercase">{school.nama_kepala || 'Belum Diisi'}</p>
                                    <p className="text-sm font-bold text-slate-500 mt-1">NIP: {school.nip_kepala || '-'}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Phone size={14} /> Nomor Telepon
                                </label>
                                <p className="text-lg font-bold text-slate-900">{school.telp_kepala || '-'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Mail size={14} /> Email Madrasah
                                </label>
                                <p className="text-lg font-bold text-slate-900 truncate" title={school.email_madrasah}>
                                    {school.email_madrasah || '-'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Operator Info */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"></div>

                        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3 relative z-10">
                            <Users className="text-emerald-400" />
                            Akun Operator
                        </h3>

                        {school.users && school.users.length > 0 ? (
                            <div className="space-y-4 relative z-10">
                                {school.users.map((user: any) => (
                                    <div key={user.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                                OP
                                            </div>
                                            <p className="font-bold text-sm tracking-wide">{user.username}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-400 pl-11">
                                            <span className="uppercase tracking-widest font-bold">{user.role?.replace('_', ' ')}</span>
                                            <span>Active</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center text-slate-400 text-sm font-bold italic">
                                Belum ada operator terdaftar
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3"
                                onClick={() => router.push('/admin/master/users')} // Direct to user management
                            >
                                KELOLA OPERATOR
                            </Button>
                        </div>
                    </div>

                    <Card title="Status Laporan">
                        <div className="p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center">
                            <p className="text-slate-400 font-bold text-sm">Belum ada data laporan bulan ini.</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
