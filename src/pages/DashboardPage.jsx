// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Zap,
  Clock,
  TrendingUp,
  Cpu,
  Activity,
  ChevronRight,
  MessagesSquare,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function DashboardPage() {
  const { user } = useAuth();
  const {
    stats,
    recentActivity,
    modelUsage,
    dailyUsage,
    loading,
    fetchDashboardData,
    fetchChatHistory,
  } = useDashboardStore();
  const [chatHistory, setChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchChatHistory().then(setChatHistory);
    }
  }, [user, fetchDashboardData, fetchChatHistory]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-aether-500" />
      </div>
    );
  }

  const statCards = [
    {
      icon: MessageSquare,
      label: 'Total Conversations',
      value: stats.totalConversations,
      color: 'from-aether-500 to-aether-400',
    },
    {
      icon: MessagesSquare,
      label: 'Total Messages',
      value: stats.totalMessages,
      color: 'from-blue-500 to-blue-400',
    },
    {
      icon: Zap,
      label: 'Tokens Used',
      value: stats.totalTokens.toLocaleString(),
      color: 'from-yellow-500 to-orange-400',
    },
    {
      icon: Cpu,
      label: 'Active Models',
      value: stats.activeModels,
      color: 'from-green-500 to-emerald-400',
    },
  ];

  const maxDailyUsage = Math.max(...dailyUsage.map((d) => d.count), 1);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome back, {user?.user_metadata?.username || 'User'}!
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'activity', label: 'Recent Activity', icon: Activity },
          { id: 'history', label: 'Chat History', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-aether-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-card p-6 transition-all duration-300 hover:border-aether-500/30 hover:shadow-lg hover:shadow-aether-500/5"
            >
              <div
                className={cn(
                  'mb-4 inline-flex rounded-xl bg-gradient-to-br p-3 text-white',
                  stat.color,
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Daily Usage Chart */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold">Messages (Last 7 Days)</h2>
            <div className="flex items-end justify-between gap-2 h-48">
              {dailyUsage.map((day, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-xs text-muted-foreground">{day.count}</div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-aether-500 to-aether-400 transition-all hover:opacity-80"
                    style={{
                      height: `${(day.count / maxDailyUsage) * 100}%`,
                      minHeight: day.count > 0 ? '20px' : '4px',
                    }}
                  />
                  <div className="text-xs text-muted-foreground">{day.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Usage */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold">Model Usage</h2>
            {modelUsage.length === 0 ? (
              <p className="text-sm text-muted-foreground">No model usage data yet.</p>
            ) : (
              <div className="space-y-4">
                {modelUsage.map((model) => (
                  <div key={model.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{model.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {model.count} msgs ({model.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-aether-500 to-aether-400"
                        style={{ width: `${model.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <div className="text-sm font-medium">Most Used Model</div>
              <div className="mt-1 text-2xl font-bold gradient-text">{stats.mostUsedModel}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="rounded-2xl border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <p className="px-6 py-8 text-center text-muted-foreground">No recent activity yet.</p>
          ) : (
            <div>
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    'flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/30',
                    index !== recentActivity.length - 1 && 'border-b',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-8 items-center justify-center rounded-lg',
                        activity.model ? 'bg-aether-500/10' : 'bg-blue-500/10',
                      )}
                    >
                      {activity.model ? (
                        <Cpu className="size-4 text-aether-500" />
                      ) : (
                        <MessageSquare className="size-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.content}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {activity.model && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.model.split('/').pop()}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="rounded-2xl border bg-card">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
          </div>
          {chatHistory.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-muted-foreground">No conversations yet.</p>
              <Link to="/chat">
                <Button variant="gradient" className="mt-4">
                  Start Your First Chat
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {chatHistory.map((conversation, index) => (
                <Link
                  key={conversation.id}
                  to="/chat"
                  className={cn(
                    'flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/30',
                    index !== chatHistory.length - 1 && 'border-b',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                      <MessageSquare className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {conversation.title || 'New Conversation'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.updated_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
