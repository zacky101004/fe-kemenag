'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Edit, Trash2, Save, X, MapPin, School as SchoolIcon, Loader2, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api';
import { KECAMATAN_KAMPAR } from '@/lib/constants';

export default function MasterMadrasahPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua Status');
    const [isLoading, setIsLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('Tambah Madrasah');
    const [formData, setFormData] = useState({
        id_madrasah: '',
        nama_madrasah: '',
        npsn: '',
        alamat: '',
        kecamatan: KECAMATAN_KAMPAR[0],
        status_aktif: 1
    });

    const [schools, setSchools] = useState<any[]>([]);

    const handleViewDetail = (item: any) => {
        router.push(`/admin/master/madrasah/${item.id_madrasah}`);
    };


    const fetchSchools = async () => {
        setIsLoading(true);
        try {
            const response = await api.master.getMadrasah();
            const data = await response.json();
            if (response.ok) {
                setSchools(data.data || data);
            }
        } catch (error) {
            console.error('Failed to fetch schools:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const filteredSchools = useMemo(() => {
        return schools.filter(school => {
            const name = school.nama_madrasah || '';
            const npsn = school.npsn || '';

            const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                npsn.includes(searchQuery);

            const matchesStatus = statusFilter === 'Semua Status' ||
                (statusFilter === 'Aktif' && school.status_aktif == 1) ||
                (statusFilter === 'Non-Aktif' && school.status_aktif == 0);

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, schools]);

    const openAddModal = () => {
        setFormData({ id_madrasah: '', nama_madrasah: '', npsn: '', alamat: '', kecamatan: KECAMATAN_KAMPAR[0], status_aktif: 1 });
        setModalTitle('Tambah Madrasah Baru');
        setIsModalOpen(true);
    };

    const openEditModal = (school: any) => {
        setFormData({
            id_madrasah: school.id_madrasah,
            nama_madrasah: school.nama_madrasah,
            npsn: school.npsn,
            alamat: school.alamat,
            kecamatan: school.kecamatan || KECAMATAN_KAMPAR[0],
            status_aktif: school.status_aktif
        });
        setModalTitle('Ubah Data Madrasah');
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (school: any) => {
        const newStatus = school.status_aktif == 1 ? 0 : 1;

        // Optimistic Update
        const updatedSchools = schools.map(s =>
            s.id_madrasah === school.id_madrasah ? { ...s, status_aktif: newStatus } : s
        );
        setSchools(updatedSchools);

        try {
            const payload = {
                id_madrasah: school.id_madrasah,
                nama_madrasah: school.nama_madrasah,
                npsn: school.npsn,
                alamat: school.alamat,
                status_aktif: newStatus
            };

            await api.master.updateMadrasah(school.id_madrasah, payload);
        } catch (error) {
            fetchSchools(); // Revert on error
            alert('Gagal mengubah status');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let response;
            if (formData.id_madrasah) {
                response = await api.master.updateMadrasah(Number(formData.id_madrasah), formData);
            } else {
                response = await api.master.storeMadrasah(formData);
            }

            if (response.ok) {
                alert(`Data berhasil disimpan!`);
                setIsModalOpen(false);
                fetchSchools();
            } else {
                const errorData = await response.json();
                alert(`Gagal: ${errorData.message}`);
            }
        } catch (error) {
            alert('Terjadi kesalahan koneksi');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus madrasah ${name}?`)) {
            try {
                const response = await api.master.deleteMadrasah(id);
                if (response.ok) {
                    alert(`${name} telah dihapus`);
                    fetchSchools();
                } else {
                    alert('Gagal menghapus data.');
                }
            } catch (error) {
                alert('Terjadi kesalahan koneksi');
            }
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-start md:items-center">
                <div>
                    <h1 className="text-slate-900 italic">Data Master Madrasah</h1>
                    <p className="text-muted text-sm uppercase mt-2">
                        Manajemen data sekolah dan unit pendidikan
                    </p>
                </div>
                <Button
                    variant="primary"
                    className="py-4 px-8 text-lg font-black bg-emerald-700 shadow-xl"
                    icon={<Plus size={24} />}
                    onClick={openAddModal}
                >
                    TAMBAH MADRASAH
                </Button>
            </div>

            <Card>
                <div className="flex flex-col md:flex-row gap-6 mb-10 items-end">
                    <div className="flex-1 max-w-md">
                        <Input
                            label="Cari Madrasah"
                            placeholder="Ketik nama atau NPSN..."
                            icon={<Search size={22} />}
                            className="mb-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-64 relative">
                        <label className="input-label">Filter Status</label>
                        <div className="relative">
                            <select
                                className="select-field appearance-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="Semua Status">Semua Status</option>
                                <option value="Aktif">Aktif</option>
                                <option value="Non-Aktif">Non-Aktif</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={20} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-emerald-700" size={48} />
                        </div>
                    )}

                    {!isLoading && filteredSchools.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-slate-400 font-bold text-lg">Tidak ada data madrasah ditemukan.</p>
                        </div>
                    )}

                    {!isLoading && filteredSchools.map((item) => (
                        <div
                            key={item.id_madrasah}
                            className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-emerald-400 hover:shadow-lg transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between gap-6">
                                {/* Left: School Info (Clickable) */}
                                <div
                                    className="flex items-center gap-4 flex-1 cursor-pointer"
                                    onClick={() => handleViewDetail(item)}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 group-hover:bg-emerald-100 group-hover:border-emerald-300 transition-colors">
                                        <SchoolIcon size={32} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight leading-tight mb-1 group-hover:text-emerald-700 transition-colors truncate">
                                            {item.nama_madrasah}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Klik untuk lihat profil lengkap
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Status & Actions */}
                                <div className="flex items-center gap-4 shrink-0">
                                    {/* Status Toggle */}
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(item); }}
                                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${item.status_aktif == 1 ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                            title={item.status_aktif == 1 ? 'Non-aktifkan' : 'Aktifkan'}
                                        >
                                            <span
                                                className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex items-center justify-center ${item.status_aktif == 1 ? 'translate-x-7' : 'translate-x-0'}`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${item.status_aktif == 1 ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            </span>
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pl-4 border-l-2 border-slate-100">
                                        <Button
                                            variant="outline"
                                            className="h-12 w-12 p-0 border-slate-200 shadow-sm hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl"
                                            icon={<Edit size={18} />}
                                            onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                                            title="Edit"
                                        />
                                        <Button
                                            variant="danger"
                                            className="h-12 w-12 p-0 border-rose-200 bg-rose-50 text-rose-600 shadow-sm hover:bg-rose-100 hover:border-rose-300 rounded-xl"
                                            icon={<Trash2 size={18} />}
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id_madrasah, item.nama_madrasah); }}
                                            title="Hapus"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalTitle}
                footer={
                    <div className="flex gap-4">
                        <Button variant="outline" className="flex-1 py-5 text-xl font-black border-4" onClick={() => setIsModalOpen(false)}>
                            BATAL
                        </Button>
                        <Button type="submit" form="madrasah-form" className="flex-1 py-5 text-xl font-black bg-emerald-700 shadow-xl">
                            SIMPAN DATA
                        </Button>
                    </div>
                }
            >
                <form id="madrasah-form" onSubmit={handleSave} className="space-y-6 text-left">
                    <Input
                        label="Nama Madrasah"
                        placeholder="Cth: MI NURUL HUDA"
                        required
                        value={formData.nama_madrasah}
                        onChange={(e) => setFormData({ ...formData, nama_madrasah: e.target.value.toUpperCase() })}
                    />
                    <Input
                        label="NPSN"
                        placeholder="Nomor Pokok Sekolah Nasional"
                        required
                        value={formData.npsn}
                        onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                    />
                    <div className="space-y-3">
                        <label className="input-label">Alamat Lengkap</label>
                        <textarea
                            className="select-field h-32 py-4 resize-none border-2"
                            placeholder="Alamat lengkap madrasah..."
                            required
                            value={formData.alamat}
                            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="input-label">Kecamatan</label>
                        <div className="relative">
                            <select
                                className="select-field border-2 appearance-none cursor-pointer uppercase pr-14"
                                value={formData.kecamatan}
                                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                                required
                            >
                                {KECAMATAN_KAMPAR.map(k => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={20} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="input-label">Status Aktif</label>
                        <div className="relative">
                            <select
                                className="select-field border-2 appearance-none cursor-pointer"
                                value={formData.status_aktif}
                                onChange={(e) => setFormData({ ...formData, status_aktif: Number(e.target.value) })}
                            >
                                <option value={1}>AKTIF</option>
                                <option value={0}>NON-AKTIF</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown size={20} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
