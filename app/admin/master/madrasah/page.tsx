'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
    Search,
    Loader2,
    Building,
    MapPin,
    ChevronDown,
    Globe,
    ArrowUpRight
} from 'lucide-react';
import { api } from '@/lib/api';

export default function KasiMasterMadrasahPage() {
    const [schools, setSchools] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [isLoading, setIsLoading] = useState(true);

    const fetchSchools = async () => {
        setIsLoading(true);
        try {
            const response = await api.master.getMadrasah();
            const data = await response.json();
            if (response.ok) {
                setSchools(data.data || data);
            }
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const filteredSchools = schools.filter(item => {
        const matchesSearch = item.nama_madrasah.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.npsn.includes(searchQuery);
        const matchesStatus = statusFilter === 'Semua Status' ||
            (statusFilter === 'Aktif' && item.status_aktif == 1) ||
            (statusFilter === 'Non-aktif' && item.status_aktif == 0);
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 pb-10 -mt-6">
            <Card>
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <div className="flex-1 relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors z-10">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari NPSN atau Nama Madrasah..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-16 pl-16 pr-6 bg-white border-[3px] border-slate-900 rounded-[1.5rem] font-bold text-slate-900 placeholder:text-slate-300 outline-none shadow-[6px_6px_0_0_#f1f5f9] focus:shadow-[6px_6px_0_0_#10b98120] focus:border-emerald-600 transition-all"
                        />
                    </div>
                    <div className="w-full md:w-72 relative group">
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                            <ChevronDown size={20} />
                        </div>
                        <select
                            className="w-full h-16 pl-8 pr-12 appearance-none bg-white border-[3px] border-slate-900 rounded-[1.5rem] font-black text-slate-900 uppercase tracking-[0.15em] text-[11px] outline-none shadow-[6px_6px_0_0_#f1f5f9] focus:shadow-[6px_6px_0_0_#10b98120] focus:border-emerald-600 transition-all cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>Semua Status</option>
                            <option>Aktif</option>
                            <option>Non-aktif</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-20 flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-emerald-600" size={48} />
                            <p className="font-black text-slate-400 uppercase tracking-widest text-[10px] italic">Sinkronisasi Database...</p>
                        </div>
                    ) : filteredSchools.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                            <Building size={64} className="mx-auto text-slate-200 mb-4" />
                            <p className="font-black text-slate-400 uppercase tracking-widest text-center">Data tidak ditemukan</p>
                        </div>
                    ) : (
                        filteredSchools.map((item) => (
                            <Link
                                href={`/admin/master/madrasah/${item.id_madrasah}`}
                                key={item.id_madrasah}
                                className="group relative bg-white border-[3px] border-slate-900 rounded-[1.5rem] p-5 shadow-[5px_5px_0_0_#f1f5f9] hover:shadow-[7px_7px_0_0_#10b98120] hover:border-emerald-600 transition-all duration-300 flex items-start gap-5 overflow-hidden"
                            >
                                {/* Refined Status Badge */}
                                <div className={`absolute top-3 right-3 px-2.5 py-1 border-2 border-slate-900 rounded-lg text-[7px] font-black uppercase tracking-wider z-10 shadow-[2px_2px_0_0_#0f172a] ${item.status_aktif == 1 ? 'bg-emerald-400 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                    {item.status_aktif == 1 ? '• AKTIF' : '• OFF'}
                                </div>

                                {/* Avatar Box - Not Italic */}
                                <div className="w-14 h-14 rounded-2xl bg-white border-[3px] border-slate-900 flex items-center justify-center text-slate-900 shadow-[4px_4px_0_0_#0f172a] group-hover:bg-slate-900 group-hover:text-white transition-all font-black text-lg shrink-0 mt-1">
                                    {item.nama_madrasah.substring(0, 2).toUpperCase()}
                                </div>

                                {/* Main Info - allowed to wrap for legibility */}
                                <div className="flex-1 min-w-0 pr-10">
                                    <h3 className="font-black text-sm md:text-base text-slate-900 uppercase tracking-tight leading-[1.2] group-hover:text-emerald-600 transition-colors mb-4 line-clamp-2 min-h-[2.4rem]">
                                        {item.nama_madrasah}
                                    </h3>

                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                            <Globe size={12} className="text-emerald-500 shrink-0" />
                                            <span>NPSN: <span className="text-slate-900">{item.npsn}</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                            <MapPin size={12} className="text-slate-300 shrink-0" />
                                            <span className="italic text-slate-500 truncate">{item.kecamatan || 'Kecamatan Belum Set'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Icon */}
                                <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                                    <ArrowUpRight size={16} className="text-white" />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
