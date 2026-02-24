'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { User, Key, AlertCircle, Save, Phone, AtSign, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function AccountSettings() {
    const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phone: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(savedUser);
        setFormData({
            name: savedUser.name || '',
            username: savedUser.username || '',
            phone: savedUser.phone || ''
        });
    }, []);

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        try {
            const res = await api.auth.updateProfile(formData);
            if (res.ok) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('Profil berhasil diperbarui!');
                window.location.reload();
            } else {
                const errData = await res.json();
                alert(`Gagal memperbarui profil: ${errData.message || 'Kesalahan server'}`);
            }
        } catch (error) {
            alert('Kesalahan koneksi: Pastikan server backend berjalan.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwordData.current_password || !passwordData.new_password) {
            alert('Mohon isi semua field password.');
            return;
        }
        if (passwordData.new_password !== passwordData.confirm_password) {
            alert('Konfirmasi password tidak cocok!');
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.auth.updatePassword(passwordData);
            if (res.ok) {
                alert('Password berhasil diubah!');
                setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                setActiveTab('info');
            } else {
                const error = await res.json();
                alert(error.message || 'Gagal mengubah password.');
            }
        } catch (error) {
            alert('Kesalahan koneksi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-4">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] border-[3px] transition-all font-black uppercase tracking-widest text-xs
                            ${activeTab === 'info'
                                ? 'bg-slate-900 text-white border-slate-900 shadow-[6px_6px_0_0_#10b981]'
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-900 hover:text-slate-900 shadow-sm'}`}
                    >
                        <User size={20} />
                        Informasi Dasar
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] border-[3px] transition-all font-black uppercase tracking-widest text-xs
                            ${activeTab === 'password'
                                ? 'bg-slate-900 text-white border-slate-900 shadow-[6px_6px_0_0_#3b82f6]'
                                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-900 hover:text-slate-900 shadow-sm'}`}
                    >
                        <Key size={20} />
                        Keamanan Akun
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'info' ? (
                        <div className="space-y-8">
                            <Card title="Identitas Pengguna">
                                <div className="space-y-8">
                                    <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] flex items-start gap-4">
                                        <AlertCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                                        <p className="text-sm font-bold text-blue-700 leading-relaxed uppercase italic">
                                            {user?.role === 'operator_sekolah'
                                                ? `NPSN Anda (${formData.username}) adalah identitas unik sistem dan tidak dapat diubah demi validitas data.`
                                                : `Username Anda adalah identitas login. Pastikan memilih nama yang mudah diingat.`}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Input
                                                label="Nama Lengkap / Nama PIC"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Sesuai KTP / SK..."
                                                icon={<User size={18} />}
                                            />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase italic px-2">Nama ini akan muncul pada dashboard dan header.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                label={user?.role === 'operator_sekolah' ? "NPSN (Login ID)" : "Username (Login ID)"}
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                placeholder="Masukkan username..."
                                                icon={<AtSign size={18} />}
                                                disabled={user?.role === 'operator_sekolah'}
                                                className={user?.role === 'operator_sekolah' ? 'bg-slate-50 opacity-70 cursor-not-allowed' : ''}
                                            />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase italic px-2">
                                                {user?.role === 'operator_sekolah' ? 'NPSN Madrasah tidak dapat diubah.' : 'Username digunakan untuk masuk ke sistem.'}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                label="Nomor WhatsApp"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Contoh: 0812..."
                                                icon={<Phone size={18} />}
                                            />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase italic px-2">Gunakan nomor aktif untuk koordinasi darurat.</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t-2 border-slate-100">
                                        <Button
                                            className="w-full md:w-auto py-6 px-12 text-lg font-black bg-emerald-600 shadow-xl"
                                            onClick={handleUpdateProfile}
                                            isLoading={isLoading}
                                            icon={<Save size={20} />}
                                        >
                                            SIMPAN PERUBAHAN PROFIL
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <Card title="Ganti Password">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 gap-8 max-w-2xl">
                                        <div className="relative">
                                            <Input
                                                label="Password Saat Ini"
                                                type={showPasswords.current ? "text" : "password"}
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                icon={<Key size={18} />}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                className="absolute right-4 top-10 text-slate-400 hover:text-slate-900"
                                            >
                                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <div className="h-px bg-slate-100" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative">
                                                <Input
                                                    label="Password Baru"
                                                    type={showPasswords.new ? "text" : "password"}
                                                    value={passwordData.new_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                    className="absolute right-4 top-10 text-slate-400 hover:text-slate-900"
                                                >
                                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    label="Konfirmasi Password Baru"
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    value={passwordData.confirm_password}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                    className="absolute right-4 top-10 text-slate-400 hover:text-slate-900"
                                                >
                                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t-2 border-slate-100">
                                        <Button
                                            className="w-full md:w-auto py-6 px-12 text-lg font-black bg-slate-900 shadow-xl"
                                            onClick={handleUpdatePassword}
                                            isLoading={isLoading}
                                            icon={<Key size={20} />}
                                        >
                                            UPDATE PASSWORD BARU
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
