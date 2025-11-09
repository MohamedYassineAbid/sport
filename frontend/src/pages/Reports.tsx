import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

const reportTypes = [
  { id: "player", name: "Player Report", description: "Detailed player performance and statistics" },
  { id: "match", name: "Match Report", description: "Complete match analysis and insights" },
  { id: "comparison", name: "Comparison Report", description: "Side-by-side player or team comparison" },
];

const metrics = [
  { id: "goals", label: "Goals & Assists" },
  { id: "passes", label: "Passing Statistics" },
  { id: "defending", label: "Defensive Metrics" },
  { id: "physical", label: "Physical Performance" },
  { id: "training", label: "Training Data" },
];

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleGenerate = () => {
    if (!reportType) {
      toast.error("Please select a report type");
      return;
    }
    if (selectedMetrics.length === 0) {
      toast.error("Please select at least one metric");
      return;
    }
    
    toast.success("Generating report...", {
      description: "Your PDF report will download shortly"
    });
    
    // Simulate report generation
    setTimeout(() => {
      toast.success("Report generated successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">Generate custom PDF reports for offline analysis</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Report Type</CardTitle>
              <CardDescription>Choose the type of report you want to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    reportType === type.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setReportType(type.id)}
                >
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        reportType === type.id ? "border-primary bg-primary" : "border-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Metrics</CardTitle>
              <CardDescription>Choose which metrics to include in your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle(metric.id)}
                  />
                  <Label htmlFor={metric.id} className="cursor-pointer font-normal">
                    {metric.label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Add any custom notes or observations</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Report Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Report Type</Label>
                <p className="font-medium mt-1">
                  {reportType ? reportTypes.find(t => t.id === reportType)?.name : "Not selected"}
                </p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Selected Metrics</Label>
                <p className="font-medium mt-1">
                  {selectedMetrics.length > 0 ? `${selectedMetrics.length} metrics` : "None"}
                </p>
              </div>

              <div>
                <Label className="text-muted-foreground">Format</Label>
                <p className="font-medium mt-1">PDF Document</p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" 
                size="lg"
                onClick={handleGenerate}
              >
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Report will be downloaded as a PDF file
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
