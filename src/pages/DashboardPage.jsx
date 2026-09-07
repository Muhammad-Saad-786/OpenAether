// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Zap,
  Cpu,
  Activity,
  ChevronRight,
  MessagesSquare,
  BarChart3,
  Loader2,
  TrendingUp,
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

  // Real stat cards - only meaningful data
  const statCards = [
    {
      icon: MessagesSquare,
      label: 'Total Messages',
      value: stats.totalMessages,
      subtext: `${stats.totalConversations} conversations`,
      color: 'from-aether-500 to-aether-400',
    },
    {
      icon: Cpu,
      label: 'Active Models',
      value: stats.activeModels,
      subtext: `Most used: ${stats.mostUsedModel}`,
      color: 'from-green-500 to-emerald-400',
    },
    {
      icon: Zap,
      label: 'Tokens Used',
      value: stats.totalTokens.toLocaleString(),
      subtext: 'Estimated usage',
      color: 'from-yellow-500 to-orange-400',
    },
  ];

  const maxDailyUsage = Math.max(...dailyUsage.map((d) => d.count), 1);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Header - Clean */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.user_metadata?.username || 'User'}
        </h1>
        <p className="mt-1 text-muted-foreground">Here's your AI usage summary.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'activity', label: 'Activity', icon: Activity },
          { id: 'history', label: 'History', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
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
      </div>

      {/* Stats - 3 Cards Only (No Clutter) */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border bg-card p-5 transition-all hover:border-aether-500/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={cn(
                    'inline-flex rounded-xl bg-gradient-to-br p-2.5 text-white',
                    stat.color,
                  )}
                >
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-1 truncate">{stat.subtext}</div>
            </div>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Daily Usage - Simple Bars */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-6">This Week</h2>
            {dailyUsage.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                No messages yet. Start chatting!
              </p>
            ) : (
              <div className="flex items-end justify-between gap-2 h-40">
                {dailyUsage.map((day, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{day.count}</span>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-aether-500/60 to-aether-400/60 hover:from-aether-500 hover:to-aether-400 transition-all"
                      style={{
                        height: `${(day.count / maxDailyUsage) * 100}%`,
                        minHeight: day.count > 0 ? '16px' : '4px',
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{day.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Usage - Clean List */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-6">Models Used</h2>
            {modelUsage.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No model data yet.</p>
            ) : (
              <div className="space-y-4">
                {modelUsage.slice(0, 5).map((model) => (
                  <div key={model.name} className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-aether-500/10">
                      <Cpu className="size-4 text-aether-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{model.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">
                          {model.count} msgs
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-aether-500 to-aether-400"
                          style={{ width: `${model.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="rounded-2xl border bg-card">
          {recentActivity.length === 0 ? (
            <p className="px-6 py-12 text-center text-muted-foreground">
              No recent activity. Start chatting to see activity here.
            </p>
          ) : (
            <div>
              {recentActivity.slice(0, 10).map((activity, index) => (
                <div
                  key={activity.id}
                  className={cn(
                    'flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/30',
                    index !== recentActivity.length - 1 && 'border-b',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg',
                        activity.model ? 'bg-aether-500/10' : 'bg-blue-500/10',
                      )}
                    >
                      {activity.model ? (
                        <Cpu className="size-4 text-aether-500" />
                      ) : (
                        <MessageSquare className="size-4 text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {activity.content}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {activity.model && (
                      <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
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
              {chatHistory.slice(0, 10).map((conversation, index) => (
                <Link
                  key={conversation.id}
                  to="/chat"
                  className={cn(
                    'flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/30',
                    index !== chatHistory.length - 1 && 'border-b',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <MessageSquare className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {conversation.title || 'New Conversation'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conversation.updated_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
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
