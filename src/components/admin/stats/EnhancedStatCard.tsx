
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

interface EnhancedStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  tooltipContent?: string;
  detailedInfo?: string;
  chartData?: React.ReactNode;
}

export const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  trend,
  tooltipContent,
  detailedInfo,
  chartData
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className="p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-muted/10 border border-transparent hover:border-border"
            onClick={() => setIsDialogOpen(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                  <AnimatedCounter
                    end={value}
                    className="text-2xl font-bold"
                  />
                  {trend && (
                    <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </span>
                  )}
                </div>
              </div>
              <Icon className={`h-8 w-8 ${iconColor}`} />
            </div>
          </Card>
        </TooltipTrigger>
        {tooltipContent && (
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        )}
      </Tooltip>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${iconColor}`} />
              {title}
            </DialogTitle>
            <DialogDescription>
              Current value: {value.toLocaleString()}
              {trend && (
                <span className={`ml-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {trend.isPositive ? '↑' : '↓'} {trend.value}%
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {detailedInfo && <p className="text-sm text-muted-foreground">{detailedInfo}</p>}
            {chartData && <div className="pt-4">{chartData}</div>}
            {!detailedInfo && !chartData && (
              <p className="text-sm text-muted-foreground">
                No additional information available for this metric.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
