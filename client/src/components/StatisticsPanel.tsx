import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, Award, Star } from "lucide-react";

interface StatisticsPanelProps {
  todayStats?: any;
  recentSessions?: any[];
}

export default function StatisticsPanel({ todayStats, recentSessions }: StatisticsPanelProps) {
  const achievements = [
    { icon: Target, name: "FOCUS MASTER", color: "text-green-400" },
    { icon: Zap, name: "STREAK LEGEND", color: "text-yellow-400" },
    { icon: Award, name: "SPEED DEMON", color: "text-blue-400" },
    { icon: Star, name: "STAR PERFORMER", color: "text-purple-400" },
  ];

  const formatSessionTime = (completedAt: string) => {
    const date = new Date(completedAt);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Session Counter */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-cyan-400 text-sm mb-2">TODAY'S SESSIONS</div>
            <div className="text-5xl font-bold neon-text pulse-glow">
              {todayStats?.focusSessions || 0}
            </div>
            <div className="text-cyan-400 text-sm mt-2">FOCUS BLOCKS COMPLETED</div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm">WEEKLY PROGRESS</div>
          </div>
          <div className="space-y-3">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
              <div key={day} className="flex justify-between items-center">
                <span className="text-sm">{day}</span>
                <div className="flex-1 mx-3 bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
                <span className="text-sm text-green-400">
                  {Math.floor(Math.random() * 15)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm">ACHIEVEMENTS</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-3 bg-gray-800 rounded-lg neon-border">
                <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                <div className="text-xs text-green-400">{achievement.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card className="glass-morphism neon-border bg-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-cyan-400 text-sm">RECENT SESSIONS</div>
          </div>
          <div className="space-y-2">
            {recentSessions?.slice(0, 8).map((session, index) => (
              <div key={session.id} className="flex justify-between items-center text-sm">
                <span className="text-green-400">
                  {formatSessionTime(session.completedAt)}
                </span>
                <span className="capitalize">
                  {session.type === 'focus' ? 'Focus Block' : 'Break'}
                </span>
                <span className="text-cyan-400">
                  {formatDuration(session.duration)}
                </span>
              </div>
            ))}
            {(!recentSessions || recentSessions.length === 0) && (
              <div className="text-center text-gray-500 text-sm py-4">
                No sessions recorded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
