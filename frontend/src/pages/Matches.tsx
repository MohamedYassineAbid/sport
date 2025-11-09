import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

const matches = [
  { id: 1, date: "2025-11-07", opponent: "FC United", score: "3-1", result: "W", competition: "League", home: true },
  { id: 2, date: "2025-11-04", opponent: "City Rovers", score: "2-0", result: "W", competition: "Cup", home: false },
  { id: 3, date: "2025-10-30", opponent: "Athletic Stars", score: "1-1", result: "D", competition: "League", home: true },
  { id: 4, date: "2025-10-27", opponent: "Valley FC", score: "0-2", result: "L", competition: "League", home: false },
  { id: 5, date: "2025-10-23", opponent: "Rangers FC", score: "4-2", result: "W", competition: "Cup", home: true },
];

const matchStats = {
  possession: 58,
  passes: 487,
  shots: 18,
  shotsOnTarget: 12,
  tackles: 24,
  fouls: 11,
};

const radarData = [
  { metric: "Possession", us: 58, opponent: 42 },
  { metric: "Shots", us: 75, opponent: 45 },
  { metric: "Passing", us: 82, opponent: 68 },
  { metric: "Tackles", us: 70, opponent: 80 },
  { metric: "Accuracy", us: 78, opponent: 72 },
];

const Matches = () => {
  const [selectedMatch, setSelectedMatch] = useState<typeof matches[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState<string>("all");

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.opponent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = resultFilter === "all" || match.result === resultFilter;
    return matchesSearch && matchesResult;
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Matches</h1>
        <p className="text-muted-foreground">View and analyze match performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search matches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="W">Wins</SelectItem>
                <SelectItem value="D">Draws</SelectItem>
                <SelectItem value="L">Losses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{match.date}</TableCell>
                  <TableCell className="font-medium">{match.opponent}</TableCell>
                  <TableCell className="font-bold">{match.score}</TableCell>
                  <TableCell>
                    <Badge variant={match.result === "W" ? "default" : match.result === "D" ? "secondary" : "destructive"}>
                      {match.result}
                    </Badge>
                  </TableCell>
                  <TableCell>{match.competition}</TableCell>
                  <TableCell>{match.home ? "Home" : "Away"}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedMatch(match)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Match Details: vs {selectedMatch?.opponent}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMatch && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-bold">{selectedMatch.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-3xl font-bold">{selectedMatch.score}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Competition</p>
                  <p className="font-bold">{selectedMatch.competition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(matchStats).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold">{value}{key === 'possession' ? '%' : ''}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" className="text-xs" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Our Team" dataKey="us" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                      <Radar name="Opponent" dataKey="opponent" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Matches;
