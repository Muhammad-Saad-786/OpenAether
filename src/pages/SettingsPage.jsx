// src/pages/SettingsPage.jsx
import { useState, useEffect } from 'react';
import {
  User,
  Key,
  Database,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { supabase } from '@/lib/supabase/client';
import { OpenRouterLogo, GroqLogo } from '@/components/icons/ProviderLogos';
import { toast } from 'sonner';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'privacy', label: 'Data & Privacy', icon: Database },
];

// Provider configurations
const providers = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access to multiple free AI models',
    url: 'https://openrouter.ai',
    logo: OpenRouterLogo,
    keyPrefix: 'sk-or-',
    freeModels: ['GPT-4o Mini', 'Gemma 26B', 'Gemma 31B', 'GLM 5.2'],
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Lightning-fast inference with generous free tier',
    url: 'https://console.groq.com',
    logo: GroqLogo,
    keyPrefix: 'gsk_',
    freeModels: ['GPT-OSS 20B', 'GPT-OSS 120B', 'Groq Compound', 'Qwen 3.6'],
  },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showKeys, setShowKeys] = useState({});
  const [newKeys, setNewKeys] = useState({});
  const [testingKey, setTestingKey] = useState(null);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  const { user } = useAuth();
  const { updateProfile, logout } = useAuthStore();
  const { apiKeys, loadApiKeys, saveApiKey, deleteApiKey, updateApiKeyStatus } = useApiKeyStore();
  const { loadConversations } = useChatStore();

  useEffect(() => {
    loadApiKeys();
    if (user) {
      setProfile({
        username: user.user_metadata?.username || '',
        email: user.email || '',
      });
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user, loadApiKeys]);

  // Handle profile picture upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl.publicUrl },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl.publicUrl);
      toast.success('Profile picture updated!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile.username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    try {
      await updateProfile({
        username: profile.username.trim(),
      });

      const {
        data: { user: refreshedUser },
        error: refreshError,
      } = await supabase.auth.getUser();
      if (refreshError) throw refreshError;

      useAuthStore.setState({ user: refreshedUser });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    }
  };

  // Save API key with provider-specific validation
  const handleSaveKey = async (providerId) => {
    const apiKey = newKeys[providerId];
    const providerConfig = providers.find((p) => p.id === providerId);

    if (!apiKey) {
      toast.error('Please enter an API key');
      return;
    }

    if (!apiKey.startsWith(providerConfig.keyPrefix)) {
      toast.error(`${providerConfig.name} key should start with ${providerConfig.keyPrefix}`);
      return;
    }

    try {
      await saveApiKey(providerId, apiKey);
      toast.success(`${providerConfig.name} API key saved!`);
      setNewKeys((prev) => ({ ...prev, [providerId]: '' }));
      loadApiKeys();
    } catch (error) {
      toast.error(`Failed to save ${providerConfig.name} API key`);
    }
  };

  const handleDeleteKey = async (providerId) => {
    try {
      await deleteApiKey(providerId);
      toast.success('API key deleted');
      loadApiKeys();
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const handleToggleKey = async (providerId, isActive) => {
    try {
      await updateApiKeyStatus(providerId, isActive);
      toast.success(`API key ${isActive ? 'activated' : 'deactivated'}`);
      loadApiKeys();
    } catch (error) {
      toast.error('Failed to update API key');
    }
  };

  // Test API key for specific provider
  const handleTestKey = async (providerId) => {
    const savedKey = apiKeys.find((k) => k.provider === providerId);
    if (!savedKey) {
      toast.error('No API key found');
      return;
    }

    setTestingKey(providerId);
    try {
      let response;

      if (providerId === 'openrouter') {
        response = await fetch('https://openrouter.ai/api/v1/models', {
          headers: {
            Authorization: `Bearer ${savedKey.api_key_encrypted}`,
          },
        });
      } else if (providerId === 'groq') {
        response = await fetch('https://api.groq.com/openai/v1/models', {
          headers: {
            Authorization: `Bearer ${savedKey.api_key_encrypted}`,
          },
        });
      }

      if (response && response.ok) {
        toast.success(`${providers.find((p) => p.id === providerId)?.name} API key is valid!`);
      } else {
        toast.error(`API key invalid (${response?.status || 'unknown'})`);
      }
    } catch (error) {
      toast.error('Failed to test API key');
    } finally {
      setTestingKey(null);
    }
  };

  // Clear all chat history
  const handleClearChatHistory = async () => {
    try {
      const { data: conversations, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const conversationIds = conversations?.map((c) => c.id) || [];

      if (conversationIds.length > 0) {
        const { error: messagesError } = await supabase
          .from('messages')
          .delete()
          .in('conversation_id', conversationIds);

        if (messagesError) throw messagesError;

        const { error: conversationsError } = await supabase
          .from('conversations')
          .delete()
          .in('id', conversationIds);

        if (conversationsError) throw conversationsError;

        toast.success('Chat history cleared successfully!');
      } else {
        toast.info('No chat history to clear');
      }

      await loadConversations();
    } catch (error) {
      console.error('Clear history error:', error);
      toast.error('Failed to clear chat history');
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== user?.email) {
      toast.error('Please type your email to confirm');
      return;
    }

    setDeletingAccount(true);
    try {
      await logout();
      toast.success('Account deleted successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account. Please contact support.');
    } finally {
      setDeletingAccount(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-lg text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Tabs */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-aether-500/10 text-aether-500'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="rounded-2xl border bg-card p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Update your account details.</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="size-20">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-aether-500 to-aether-400 text-white">
                        {profile.username?.charAt(0)?.toUpperCase() || 'O'}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-aether-500 p-1.5 text-white hover:bg-aether-600 transition-colors">
                      {uploadingAvatar ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Upload className="size-3" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{profile.username || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Username</label>
                    <Input
                      value={profile.username}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, username: e.target.value }))
                      }
                      placeholder="Your username"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input value={profile.email} className="pl-9" disabled />
                    </div>
                  </div>
                </div>

                <Button variant="gradient" onClick={handleProfileUpdate}>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </Button>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'api-keys' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold">API Keys</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add your free API keys to start using AI models.
                  </p>
                </div>

                {/* Render all providers */}
                {providers.map((provider) => {
                  const ProviderLogo = provider.logo;
                  const savedKey = apiKeys.find((k) => k.provider === provider.id);

                  return (
                    <div key={provider.id} className="rounded-xl border p-6">
                      <div className="mb-4 flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-muted p-2">
                          <ProviderLogo className="size-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.description}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {provider.freeModels.map((model) => (
                              <span
                                key={model}
                                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                              >
                                {model}
                              </span>
                            ))}
                          </div>
                        </div>
                        <a
                          href={provider.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-aether-500 hover:underline shrink-0"
                        >
                          Get Key →
                        </a>
                      </div>

                      {savedKey ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-lg bg-muted px-3 py-2 text-sm font-mono">
                              {showKeys[provider.id]
                                ? savedKey.api_key_encrypted
                                : '••••••••••••••••••••'}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setShowKeys((prev) => ({
                                  ...prev,
                                  [provider.id]: !prev[provider.id],
                                }))
                              }
                            >
                              {showKeys[provider.id] ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteKey(provider.id)}
                            >
                              <Trash2 className="size-4 text-red-500" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {savedKey.is_active ? 'Active' : 'Inactive'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTestKey(provider.id)}
                                disabled={testingKey === provider.id}
                              >
                                {testingKey === provider.id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="size-4" />
                                )}
                                Test
                              </Button>
                            </div>
                            <Switch
                              checked={savedKey.is_active}
                              onCheckedChange={(checked) => handleToggleKey(provider.id, checked)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            type="password"
                            placeholder={`Enter ${provider.name} API key (${provider.keyPrefix}...)`}
                            value={newKeys[provider.id] || ''}
                            onChange={(e) =>
                              setNewKeys((prev) => ({ ...prev, [provider.id]: e.target.value }))
                            }
                          />
                          <Button variant="gradient" onClick={() => handleSaveKey(provider.id)}>
                            <Plus className="mr-2 size-4" />
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold">Data & Privacy</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage your data and privacy settings.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border p-4">
                    <h3 className="font-medium">Clear Chat History</h3>
                    <p className="text-sm text-muted-foreground">
                      Delete all your conversations and messages.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={handleClearChatHistory}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Clear History
                    </Button>
                  </div>

                  <div className="rounded-xl border border-red-500/20 p-4">
                    <h3 className="font-medium text-red-500">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <AlertTriangle className="mr-2 size-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted. Type your
              email to confirm:
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={user?.email}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deletingAccount || deleteConfirmText !== user?.email}
            >
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsPage;
