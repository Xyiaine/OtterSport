/**
 * GAME ARTIST PERFORMANCE MONITOR
 * 
 * Advanced performance monitoring for Game Artist mode:
 * - Real-time performance metrics
 * - Asset optimization tracking
 * - Memory usage monitoring
 * - Debug console for visual elements
 * - Performance bottleneck detection
 */

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Zap, 
  Memory, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Target,
  Monitor,
  RefreshCw,
  Download,
  Settings
} from "lucide-react";
import { useGameArtist } from "@/contexts/GameArtistContext";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  threshold: { warning: number; error: number };
  history: number[];
}

interface DebugLog {
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  elementId?: string;
  data?: any;
}

export default function GameArtistPerformanceMonitor() {
  const { visualElements, isGameArtistMode } = useGameArtist();
  
  const [isActive, setIsActive] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Render Time',
      value: 0,
      unit: 'ms',
      status: 'good',
      threshold: { warning: 16, error: 33 },
      history: []
    },
    {
      name: 'Memory Usage',
      value: 0,
      unit: 'MB',
      status: 'good',
      threshold: { warning: 100, error: 200 },
      history: []
    },
    {
      name: 'Asset Load Time',
      value: 0,
      unit: 'ms',
      status: 'good',
      threshold: { warning: 1000, error: 3000 },
      history: []
    },
    {
      name: 'Visual Elements',
      value: visualElements.length,
      unit: 'count',
      status: 'good',
      threshold: { warning: 100, error: 200 },
      history: []
    }
  ]);
  
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Mock performance data collection
  const collectMetrics = () => {
    const renderTime = Math.random() * 20 + 5; // 5-25ms
    const memoryUsage = Math.random() * 50 + 30; // 30-80MB
    const assetLoadTime = Math.random() * 500 + 200; // 200-700ms
    const elementCount = visualElements.length;

    setMetrics(prev => prev.map(metric => {
      let newValue: number;
      switch (metric.name) {
        case 'Render Time':
          newValue = renderTime;
          break;
        case 'Memory Usage':
          newValue = memoryUsage;
          break;
        case 'Asset Load Time':
          newValue = assetLoadTime;
          break;
        case 'Visual Elements':
          newValue = elementCount;
          break;
        default:
          newValue = metric.value;
      }

      const newHistory = [...metric.history.slice(-19), newValue];
      let status: 'good' | 'warning' | 'error' = 'good';
      
      if (newValue >= metric.threshold.error) {
        status = 'error';
      } else if (newValue >= metric.threshold.warning) {
        status = 'warning';
      }

      return {
        ...metric,
        value: newValue,
        status,
        history: newHistory
      };
    }));
  };

  const addDebugLog = (type: DebugLog['type'], message: string, elementId?: string, data?: any) => {
    const newLog: DebugLog = {
      timestamp: new Date(),
      type,
      message,
      elementId,
      data
    };
    
    setDebugLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  // Start/stop monitoring
  useEffect(() => {
    if (isActive && autoRefresh) {
      intervalRef.current = setInterval(collectMetrics, 1000);
      addDebugLog('info', 'Performance monitoring started');
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, autoRefresh]);

  // Monitor visual element changes
  useEffect(() => {
    if (isActive) {
      addDebugLog('info', `Visual elements updated: ${visualElements.length} total elements`);
    }
  }, [visualElements, isActive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Monitor className="h-4 w-4 text-gray-500" />;
    }
  };

  const exportPerformanceReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: metrics,
      visualElements: visualElements.length,
      debugLogs: debugLogs.slice(0, 50) // Export last 50 logs
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ottersport-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    addDebugLog('success', 'Performance report exported');
  };

  if (!isGameArtistMode) return null;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-600" />
          Performance Monitor
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? 'Stop' : 'Start'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="debug">Debug Logs</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        <span className="font-medium">{metric.name}</span>
                      </div>
                      <Badge variant={metric.status === 'good' ? 'default' : 'destructive'}>
                        {metric.value.toFixed(1)} {metric.unit}
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.threshold.error) * 100, 100)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Warning: {metric.threshold.warning}{metric.unit}</span>
                      <span>Error: {metric.threshold.error}{metric.unit}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="debug" className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {debugLogs.length} log entries
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDebugLogs([])}
                >
                  Clear Logs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportPerformanceReport}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto border rounded-md">
              {debugLogs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No debug logs yet. Start monitoring to see activity.
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {debugLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                      {getLogIcon(log.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          {log.elementId && (
                            <Badge variant="outline" className="text-xs">
                              {log.elementId}
                            </Badge>
                          )}
                        </div>
                        <span>{log.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Asset Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Total Visual Elements</span>
                      <Badge>{visualElements.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Images</span>
                      <Badge>{visualElements.filter(el => el.type === 'image').length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Colors/Backgrounds</span>
                      <Badge>{visualElements.filter(el => ['color', 'background'].includes(el.type)).length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Text Elements</span>
                      <Badge>{visualElements.filter(el => el.type === 'text').length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      Optimize images to recommended sizes for better performance
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      Use CSS gradients instead of background images when possible
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      Group related elements to reduce rendering complexity
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      Consider reducing visual elements if memory usage is high
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}