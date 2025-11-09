import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  {
    question: "How do I view detailed match statistics?",
    answer: "Navigate to the Matches page and click on any match to view detailed statistics including possession, passes, shots, and performance charts."
  },
  {
    question: "Can I compare multiple players at once?",
    answer: "Currently, you can compare two players at a time on the Comparison page. Select the players from the dropdown menus to see side-by-side statistics."
  },
  {
    question: "How are training loads calculated?",
    answer: "Training loads are calculated using the J-Count system which factors in volume, intensity, and recovery periods to provide comprehensive load metrics."
  },
  {
    question: "What formats are available for report exports?",
    answer: "Reports can be exported as PDF documents with customizable metrics and visualizations. Future updates will include Excel and CSV formats."
  },
  {
    question: "How often is the data updated?",
    answer: "Match data is updated immediately after games. Training data is typically synced daily, and player statistics are recalculated in real-time."
  },
];

const systemStatus = [
  { service: "Database", status: "operational" },
  { service: "Analytics Engine", status: "operational" },
  { service: "Reports Service", status: "operational" },
  { service: "Authentication", status: "operational" },
];

const Help = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request submitted successfully!");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Find answers and get assistance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Send us a message and we'll get back to you</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" className="mt-2" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" className="mt-2" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="mt-2" required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue or question..." 
                    className="mt-2 min-h-32"
                    required 
                  />
                </div>
                <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current operational status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemStatus.map((item) => (
                <div key={item.service} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.service}</span>
                  <Badge variant="default" className="bg-success">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Operational
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                📚 Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🎥 Video Tutorials
              </Button>
              <Button variant="outline" className="w-full justify-start">
                💬 Community Forum
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📧 Email Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
