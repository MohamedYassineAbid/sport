import { KPICard } from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, TrendingUp, Users, AlertCircle, Calendar, Activity, Download } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const performanceData = [
  { week: "W1", goals: 2, assists: 3, shots: 12 },
  { week: "W2", goals: 3, assists: 2, shots: 15 },
  { week: "W3", goals: 1, assists: 4, shots: 10 },
  { week: "W4", goals: 4, assists: 1, shots: 18 },
  { week: "W5", goals: 2, assists: 3, shots: 14 },
];

const recentMatches = [
  { date: "2025-11-07", opponent: "FC United", result: "W", score: "3-1" },
  { date: "2025-11-04", opponent: "City Rovers", result: "W", score: "2-0" },
  { date: "2025-10-30", opponent: "Athletic Stars", result: "D", score: "1-1" },
  { date: "2025-10-27", opponent: "Valley FC", result: "L", score: "0-2" },
];

const shotPerformanceData = [
  { 
    player: "Marcus Silva #10", 
    shots: 18, 
    shotsOnTarget: 12, 
    goals: 4,
    accuracy: 67,
    conversionRate: 22,
    status: "excellent",
    details: "Top performer with consistent accuracy and clinical finishing"
  },
  { 
    player: "James Carter #7", 
    shots: 15, 
    shotsOnTarget: 4, 
    goals: 1,
    accuracy: 27,
    conversionRate: 7,
    status: "critical",
    details: "Poor shot accuracy (27%) - needs shooting practice. Low conversion rate indicates fatigue or injury concerns"
  },
  { 
    player: "Alex Torres #9", 
    shots: 22, 
    shotsOnTarget: 15, 
    goals: 3,
    accuracy: 68,
    conversionRate: 14,
    status: "good",
    details: "Good accuracy but missing scoring opportunities. Recommend one-on-one finishing drills"
  },
  { 
    player: "Ryan Bennett #11", 
    shots: 12, 
    shotsOnTarget: 3, 
    goals: 0,
    accuracy: 25,
    conversionRate: 0,
    status: "critical",
    details: "Critical decline in performance. Only 25% accuracy with zero goals. Possible injury or confidence issue - medical check recommended"
  },
];

const alertsData = [
  {
    type: "injury",
    severity: "high",
    player: "James Carter #7",
    title: "Hamstring Strain - Medical Attention Required",
    description: "Player reported tightness in left hamstring during training. Reduced mobility observed. Medical examination scheduled for today.",
    details: "Symptoms: Muscle tightness, reduced sprint speed, discomfort when kicking. Recommended: Rest for 3-5 days, physiotherapy, gradual return to training.",
    timestamp: "2h ago",
    status: "urgent"
  },
  {
    type: "injury",
    severity: "medium",
    player: "Ryan Bennett #11",
    title: "Ankle Sprain - Recovery Monitoring",
    description: "Minor ankle sprain from last match. Player is undergoing treatment and recovery protocol.",
    details: "Injury occurred during tackle in 67th minute. Swelling reduced, mobility improving. Expected return: 7-10 days with physiotherapy.",
    timestamp: "1d ago",
    status: "warning"
  },
  {
    type: "performance",
    severity: "high",
    player: "Alex Torres #9",
    title: "Performance Decline - Possible Fatigue",
    description: "Significant drop in performance metrics over last 3 matches. May indicate overtraining or underlying health issue.",
    details: "Conversion rate down 40%, slower sprint times, increased fatigue complaints. Recommend: Medical checkup, reduced training intensity, nutrition assessment.",
    timestamp: "5h ago",
    status: "warning"
  },
  {
    type: "tactical",
    severity: "low",
    player: "Team",
    title: "Upcoming Match: vs Rangers FC - High Risk",
    description: "Critical match against league leaders. Current injury list may impact defensive strategy.",
    details: "Rangers FC: Strong attacking record (2.8 goals/match). Our defense weakened with Carter & Bennett injuries. Suggest: Defensive formation, counter-attack strategy.",
    timestamp: "1d ago",
    status: "info"
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your team overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Matches Played" value={32} change={12.5} icon={Trophy} variant="default" />
        <KPICard title="Win Rate" value="68%" change={5.2} icon={Target} variant="success" />
        <KPICard title="Goals Scored" value={87} change={15.3} icon={TrendingUp} variant="default" />
        <KPICard title="Active Players" value={24} change={0} icon={Users} variant="default" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Line type="monotone" dataKey="goals" stroke="hsl(var(--chart-1))" strokeWidth={2} />
              <Line type="monotone" dataKey="assists" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMatches.map((match, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Badge variant={match.result === "W" ? "default" : match.result === "D" ? "secondary" : "destructive"}>
                    {match.result}
                  </Badge>
                  <div>
                    <p className="font-medium">{match.opponent}</p>
                    <p className="text-xs text-muted-foreground">{match.date}</p>
                  </div>
                </div>
                <p className="font-bold text-lg">{match.score}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {shotPerformanceData.map((player, idx) => (
                <div 
                  key={idx} 
                  className={`min-w-[280px] p-4 rounded-lg border-2 ${
                    player.status === 'critical' 
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-500' 
                      : player.status === 'excellent'
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-500'
                      : 'bg-muted/50 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm">{player.player}</p>
                      <Badge 
                        variant={
                          player.status === 'critical' 
                            ? 'destructive' 
                            : player.status === 'excellent'
                            ? 'default'
                            : 'secondary'
                        }
                        className="mt-1"
                      >
                        {player.status === 'critical' ? '⚠️ Critical' : player.status === 'excellent' ? '⭐ Excellent' : '✓ Good'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${player.status === 'critical' ? 'text-red-600' : ''}`}>
                        {player.goals}
                      </p>
                      <p className="text-xs text-muted-foreground">Goals</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Shot Accuracy</span>
                      <span className={`font-semibold ${player.accuracy < 30 ? 'text-red-600' : ''}`}>
                        {player.accuracy}%
                      </span>
                    </div>
                    <Progress 
                      value={player.accuracy} 
                      className={`h-2 ${player.accuracy < 30 ? '[&>*]:bg-red-500' : ''}`}
                    />
                    
                    <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Shots</p>
                        <p className="font-semibold">{player.shots}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">On Target</p>
                        <p className={`font-semibold ${player.shotsOnTarget < 5 ? 'text-red-600' : ''}`}>
                          {player.shotsOnTarget}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conv. Rate</p>
                        <p className={`font-semibold ${player.conversionRate < 10 ? 'text-red-600' : ''}`}>
                          {player.conversionRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-xs p-2 rounded ${
                    player.status === 'critical' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200' 
                      : player.status === 'excellent'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <p className="font-medium">{player.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader className="bg-red-50 dark:bg-red-950/20">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            Alerts & Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {alertsData.map((alert, idx) => (
              <div 
                key={idx}
                className={`min-w-[350px] p-4 rounded-lg border-2 ${
                  alert.status === 'urgent'
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-500'
                    : alert.status === 'warning'
                    ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-500'
                    : 'bg-blue-50 dark:bg-blue-950/30 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className={`h-4 w-4 ${
                        alert.status === 'urgent' ? 'text-red-600' : 
                        alert.status === 'warning' ? 'text-orange-600' : 
                        'text-blue-600'
                      }`} />
                      <Badge 
                        variant={alert.status === 'urgent' ? 'destructive' : 'secondary'}
                        className={
                          alert.status === 'warning' 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                            : alert.status === 'info'
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : ''
                        }
                      >
                        {alert.type === 'injury' ? '🚑 Injury' : 
                         alert.type === 'performance' ? '⚠️ Performance' : 
                         '📋 Tactical'}
                      </Badge>
                    </div>
                    <p className="font-bold text-sm mb-1">{alert.player}</p>
                    <p className={`font-semibold text-xs mb-2 ${
                      alert.status === 'urgent' ? 'text-red-700 dark:text-red-300' :
                      alert.status === 'warning' ? 'text-orange-700 dark:text-orange-300' :
                      'text-blue-700 dark:text-blue-300'
                    }`}>
                      {alert.title}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {alert.timestamp}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {alert.description}
                  </p>
                  
                  <div className={`text-xs p-3 rounded-md ${
                    alert.status === 'urgent'
                      ? 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200'
                      : alert.status === 'warning'
                      ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-200'
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200'
                  }`}>
                    <p className="font-medium leading-relaxed">{alert.details}</p>
                  </div>
                  {/* If this is a performance alert, offer the ONNX preprocessing/model file for download */}
                  {alert.type === 'performance' && (
                    <div className="pt-3">
                      <a href="/models/player_prep_model.onnx" download className="inline-block">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download model (ONNX)
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
