import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GitCompare } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const players = [
  { id: 1, name: "Marcus Silva" },
  { id: 2, name: "David Chen" },
  { id: 3, name: "Lucas Brown" },
  { id: 4, name: "Alex Rodriguez" },
];

const radarData = [
  { attribute: "Speed", player1: 85, player2: 72 },
  { attribute: "Shooting", player1: 78, player2: 88 },
  { attribute: "Passing", player1: 82, player2: 91 },
  { attribute: "Dribbling", player1: 88, player2: 75 },
  { attribute: "Defending", player1: 65, player2: 70 },
  { attribute: "Physical", player1: 80, player2: 85 },
];

const statsData = [
  { metric: "Goals", player1: 15, player2: 9 },
  { metric: "Assists", player1: 8, player2: 12 },
  { metric: "Shots", player1: 87, player2: 65 },
  { metric: "Passes", player1: 542, player2: 789 },
  { metric: "Tackles", player1: 34, player2: 28 },
];

const Comparison = () => {
  const [player1, setPlayer1] = useState("1");
  const [player2, setPlayer2] = useState("2");

  const player1Name = players.find(p => p.id.toString() === player1)?.name || "Player 1";
  const player2Name = players.find(p => p.id.toString() === player2)?.name || "Player 2";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Player Comparison</h1>
        <p className="text-muted-foreground">Compare player statistics and attributes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Select Players to Compare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <Select value={player1} onValueChange={setPlayer1}>
              <SelectTrigger>
                <SelectValue placeholder="Select player 1" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold">VS</span>
              </div>
            </div>

            <Select value={player2} onValueChange={setPlayer2}>
              <SelectTrigger>
                <SelectValue placeholder="Select player 2" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id.toString()}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attribute Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="attribute" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar 
                  name={player1Name} 
                  dataKey="player1" 
                  stroke="hsl(var(--chart-1))" 
                  fill="hsl(var(--chart-1))" 
                  fillOpacity={0.6} 
                />
                <Radar 
                  name={player2Name} 
                  dataKey="player2" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.6} 
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={statsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="metric" type="category" width={80} className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Bar dataKey="player1" fill="hsl(var(--chart-1))" name={player1Name} radius={[0, 8, 8, 0]} />
                <Bar dataKey="player2" fill="hsl(var(--chart-2))" name={player2Name} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Head-to-Head Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {statsData.map((stat) => (
              <Card key={stat.metric}>
                <CardContent className="pt-6">
                  <p className="text-center text-sm text-muted-foreground mb-3">{stat.metric}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <p className="text-2xl font-bold text-primary">{stat.player1}</p>
                      <p className="text-xs text-muted-foreground mt-1">{player1Name}</p>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="text-center flex-1">
                      <p className="text-2xl font-bold text-accent">{stat.player2}</p>
                      <p className="text-xs text-muted-foreground mt-1">{player2Name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comparison;
