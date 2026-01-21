import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const AuthForm = ({ type, onComplete, onSwitch }) => {
    const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onComplete(formData);
        }, 1000);
    };

    return (
        <div className="max-w-md mx-auto p-8 w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="bg-black dark:bg-white dark:text-black text-white p-3 rounded-2xl shadow-lg">
                        <img src="https://static.hey.xyz/images/app-icon/0.png" alt="Logo" className="w-10 h-10 filter invert dark:filter-none" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold mb-2 dark:text-white tracking-tight">{type === 'login' ? 'Welcome back!' : 'Join Hey today'}</h2>
                <p className="text-zinc-500 font-medium">The decentralized social network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {type === 'signup' && (
                    <>
                        <Input
                            label="Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </>
                )}
                <Input
                    label="Username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />

                <Button type="submit" className="w-full justify-center py-3 mt-6 text-lg" disabled={loading}>
                    {loading ? <Loader2 size={24} className="animate-spin" /> : (type === 'login' ? 'Log in' : 'Sign up')}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-zinc-500">{type === 'login' ? "Don't have an account?" : "Already have an account?"}</span>
                <button onClick={onSwitch} className="font-bold ml-1 hover:underline dark:text-white">
                    {type === 'login' ? 'Sign up' : 'Log in'}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
