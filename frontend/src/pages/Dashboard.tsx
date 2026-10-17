import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, FileSpreadsheet, LayoutTemplate, Network, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const recentDatasets = [
    { id: "ds-9821", name: "Retail_Q3_Sales", type: "Standard", rows: "50,000", time: "2 hours ago" },
    { id: "ds-9820", name: "Healthcare_Patients", type: "Template", rows: "10,000", time: "5 hours ago" },
    { id: "ds-9819", name: "Churn_Prediction_ML", type: "ML/AI", rows: "25,000", time: "1 day ago" },
    { id: "ds-9818", name: "Banking_Transactions", type: "Star Schema", rows: "100,000", time: "2 days ago" },
  ];

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your datasets.</p>
        </div>
        <Link to="/generator">
          <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md">
            <Plus className="w-4 h-4" /> New Dataset
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
            <Database className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Rows Generated</CardTitle>
            <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-muted-foreground mt-1">+300k this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground mt-1">3 new templates added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">Generation queue is optimal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Datasets */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Generations</CardTitle>
              <CardDescription>Your latest generated datasets and schema builds.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDatasets.map((ds) => (
                  <div key={ds.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 text-primary rounded-md">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{ds.name}</p>
                        <p className="text-xs text-muted-foreground">{ds.type} • {ds.rows} rows</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{ds.time}</p>
                      <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump straight into your workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/generator" className="block">
                <div className="group p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Database className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Standard Generator</p>
                      <p className="text-xs text-muted-foreground">Domain specific tables</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link to="/templates" className="block">
                <div className="group p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <LayoutTemplate className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Template Gallery</p>
                      <p className="text-xs text-muted-foreground">Use prebuilt industry schemas</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              <Link to="/modeling" className="block">
                <div className="group p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Network className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Data Modeling</p>
                      <p className="text-xs text-muted-foreground">Visually design relationships</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
