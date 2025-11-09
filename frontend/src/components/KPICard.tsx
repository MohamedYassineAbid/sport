import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const KPICard = ({ title, value, change, icon: Icon, variant = "default" }: KPICardProps) => {
  const variantClasses = {
    default: "from-primary to-accent",
    success: "from-success to-emerald-600",
    warning: "from-warning to-orange-600",
    destructive: "from-destructive to-red-600",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change !== undefined && (
              <p className={cn("text-sm font-medium", change >= 0 ? "text-success" : "text-destructive")}>
                {change >= 0 ? "+" : ""}{change}% from last period
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl bg-gradient-to-br", variantClasses[variant])}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
