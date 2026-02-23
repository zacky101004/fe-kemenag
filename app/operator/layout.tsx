'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Menu, UserCircle, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname.includes('/dashboard')) return 'RINGKASAN SISTEM';
        if (pathname.includes('/profil')) return 'IDENTITAS MADRASAH';
        if (pathname.includes('/laporan')) return 'PELAPORAN RUTIN';
        return 'OPERATOR AREA';
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            <Sidebar role="operator" isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 md:ml-[20rem] transition-all duration-300">
                <header className="h-24 bg-white/80 backdrop-blur-md border-b-[3px] border-slate-900 flex items-center px-6 md:px-12 justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-6">
                        <button
                            className="md:hidden p-4 hover:bg-slate-100 rounded-2xl border-[3px] border-slate-900 shadow-[4px_4px_0_0_#0f172a] transition-all active:translate-y-1 active:shadow-none bg-white"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu size={24} className="text-slate-900" />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="font-black text-2xl leading-none text-slate-900 italic tracking-tighter">{getTitle()}</h2>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Panel Manajemen Madrasah
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 pl-6 border-l-2 border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Selamat Datang,</p>
                                <p className="text-xs font-black text-slate-900 uppercase">Operator Sekolah</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 border-2 border-slate-900 text-white flex items-center justify-center shadow-[4px_4px_0_0_#0f172a]">
                                <UserCircle size={24} />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-12 max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
