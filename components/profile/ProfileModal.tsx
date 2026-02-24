'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Key, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
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

    useEffect(() => {
        if (isOpen) {
            const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(savedUser);
            setFormData({
                name: savedUser.name || '',
                username: savedUser.username || '',
                phone: savedUser.phone || ''
            });
        }
    }, [isOpen]);

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        try {
            const res = await api.auth.updateProfile(formData);
            if (res.ok) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert('Profil berhasil diperbarui!');
                onClose();
                window.location.reload(); // Refresh to update UI everywhere
            } else {
                alert('Gagal memperbarui profil.');
            }
        } catch (error) {
            alert('Kesalahan koneksi');
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
                onClose();
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Kelola Profil Akun"
        >
            <div className="space-y-8">
                {/* Tabs */}
                <div className="flex gap-4 border-b-2 border-slate-100 pb-2">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'info' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Informasi Dasar
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'password' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Ganti Password
                    </button>
                </div>

                {activeTab === 'info' ? (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[2rem] flex items-start gap-4">
                            <AlertCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                            <p className="text-xs font-bold text-blue-700 leading-relaxed uppercase italic">
                                Username Anda bersifat permanen dan tidak dapat diubah untuk menjaga integritas data sistem.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Username Login"
                                value={formData.username}
                                onChange={() => { }} // Read-only but keeps standard styles
                                disabled
                                icon={<User size={18} />}
                            />
                            <Input
                                label="Nama Lengkap / PIC"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Masukkan nama..."
                                icon={<User size={18} />}
                            />
                        </div>
                        <Input
                            label="Nomor WhatsApp / HP"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Contoh: 08123456789"
                        />

                        <Button
                            className="w-full py-6 text-lg font-black bg-slate-900 mt-4"
                            onClick={handleUpdateProfile}
                            isLoading={isLoading}
                        >
                            SIMPAN PERUBAHAN
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Input
                            label="Password Saat Ini"
                            type="password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                            icon={<Key size={18} />}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-50">
                            <Input
                                label="Password Baru"
                                type="password"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                            />
                            <Input
                                label="Konfirmasi Password Baru"
                                type="password"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                            />
                        </div>
                        <Button
                            className="w-full py-6 text-lg font-black bg-emerald-600 mt-4"
                            onClick={handleUpdatePassword}
                            isLoading={isLoading}
                        >
                            UPDATE PASSWORD KEAMANAN
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
