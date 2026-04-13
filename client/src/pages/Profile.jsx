import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Mail, DollarSign, Moon, Sun, Save, Type } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Local state for form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: '',
        currency: 'USD',
        theme: 'light',
        useLetterAvatar: false
    });

    // Initialize form from user data
    useEffect(() => {
        if (user) {
            const useLetterAvatar = user.avatar === 'letter' || !user.avatar || user.avatar === '';
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Don't prefill password
                avatar: useLetterAvatar ? 'letter' : user.avatar,
                currency: user.currency || 'USD',
                theme: user.theme || 'light',
                useLetterAvatar: useLetterAvatar
            });
        }
    }, [user]);

    // Handle redirect after profile update
    useEffect(() => {
        if (shouldRedirect) {
            navigate('/', { replace: true });
            setShouldRedirect(false);
        }
    }, [shouldRedirect, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Apply theme immediately when changed
    const handleThemeChange = (e) => {
        const newTheme = e.target.value;
        setFormData({ ...formData, theme: newTheme });

        // Apply theme immediately to DOM
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.error("Name and Email are required");
            return;
        }

        // Prepare data to send
        const dataToSend = { ...formData };
        if (!dataToSend.password) delete dataToSend.password;
        if (dataToSend.avatar === 'letter') dataToSend.avatar = '';
        delete dataToSend.useLetterAvatar;

        try {
            const token = user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const res = await axios.put('https://expense-tracker-1-y2e5.onrender.com/api/users/profile', dataToSend, config);

            // Update context with new user data (includes new token)
            updateUser(res.data);

            toast.success("Settings saved successfully!");
            
            // Trigger redirect after state update
            setShouldRedirect(true);
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || "Error updating profile");
        }
    };

    const avatars = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Max"
    ];

    // Get the letter avatar display
    const getLetterAvatar = () => {
        return (formData.name || 'U').charAt(0).toUpperCase();
    };

    // Determine what to show in the main avatar display
    const renderMainAvatar = () => {
        if (formData.avatar === 'letter' || formData.useLetterAvatar) {
            return (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary">{getLetterAvatar()}</span>
                </div>
            );
        } else {
            return <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-foreground">User Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="md:col-span-1 flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-muted">
                        {renderMainAvatar()}
                    </div>
                    <p className="text-sm text-muted-foreground">Select an avatar</p>

                    {/* Letter Avatar Option */}
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: 'letter', useLetterAvatar: true })}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border-2 transition-all ${formData.avatar === 'letter' || formData.useLetterAvatar
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border hover:border-primary/50'
                            }`}
                    >
                        <Type className="w-4 h-4" />
                        Use First Letter ({getLetterAvatar()})
                    </button>

                    {/* Avatar Options */}
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {avatars.map((av, i) => (
                            <button
                                type="button"
                                key={i}
                                onClick={() => setFormData({ ...formData, avatar: av, useLetterAvatar: false })}
                                className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all ${formData.avatar === av && !formData.useLetterAvatar
                                    ? 'border-primary ring-2 ring-ring'
                                    : 'border-transparent hover:border-gray-400'
                                    }`}
                            >
                                <img src={av} alt={`avatar option ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="md:col-span-2 bg-card p-6 rounded-lg shadow-sm border border-border">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-foreground">
                                <User className="w-4 h-4" /> Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-foreground">
                                <Mail className="w-4 h-4" /> Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-foreground">
                                <DollarSign className="w-4 h-4" /> Currency
                            </label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="CAD">CAD ($)</option>
                                <option value="AUD">AUD ($)</option>
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Currency changes will be reflected across all pages after saving
                            </p>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-1 text-foreground">
                                {formData.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Theme
                            </label>
                            <select
                                name="theme"
                                value={formData.theme}
                                onChange={handleThemeChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Theme changes apply immediately
                            </p>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <label className="block text-sm font-medium mb-1 text-foreground">New Password (optional)</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Leave blank to keep current password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 mt-4 font-medium shadow-sm">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
