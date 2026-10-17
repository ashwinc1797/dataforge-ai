import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Play, BrainCircuit, Activity, Database } from "lucide-react";
import { DatasetAPI } from "@/lib/api";

export default function MLGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  
  const [taskType, setTaskType] = useState("Classification");
  const [scenario, setScenario] = useState("Customer Churn");
  const [rowCount, setRowCount] = useState(1000);
  const [columnCount, setColumnCount] = useState<number | "">("");
  const [region, setRegion] = useState("India");
  const [dirtyPercentage, setDirtyPercentage] = useState(0);

  const taskOptions = ["Classification", "Regression", "Clustering", "Time Series"];
  const scenarioOptions = [
    "Customer Churn", "Loan Default", "Fraud Detection", "Employee Attrition", 
    "House Price Prediction", "Sales Forecasting", "Customer Segmentation", "Retail Sales"
  ];

  const handleDrop = async (tableName: string, targetCol: string) => {
    if (!draggedCol || draggedCol === targetCol || !jobData) return;
    
    const oldRows = jobData.preview[tableName];
    if (!oldRows || oldRows.length === 0) return;
    
    const columns = Object.keys(oldRows[0]);
    const draggedIdx = columns.indexOf(draggedCol);
    const targetIdx = columns.indexOf(targetCol);
    
    const newCols = [...columns];
    newCols.splice(draggedIdx, 1);
    newCols.splice(targetIdx, 0, draggedCol);
    
    const newRows = oldRows.map((row: any) => {
      const newRow: any = {};
      newCols.forEach(col => newRow[col] = row[col]);
      return newRow;
    });
    
    setJobData((prev: any) => ({
      ...prev,
      preview: { ...prev.preview, [tableName]: newRows }
    }));
    
    try {
      await DatasetAPI.reorderColumns(jobData.job_id, tableName, newCols);
    } catch (e) {
      console.error("Failed to update column order on backend", e);
    }
    setDraggedCol(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setJobData(null);
    try {
      const config = {
        task_type: taskType,
        scenario: scenario,
        row_count: rowCount,
        column_count: columnCount === "" ? undefined : columnCount,
        region: region,
        dirty_percentage: dirtyPercentage,
      };
      
      const result = await DatasetAPI.generateML(config);
      setJobData(result);
    } catch (error) {
      console.error("Failed to generate ML dataset", error);
      alert("Error generating ML dataset. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: string) => {
    if (jobData?.job_id) {
      DatasetAPI.exportData(jobData.job_id, format);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ML Dataset Generator</h1>
        <p className="text-muted-foreground mt-1">Generate highly realistic tabular data specifically designed for training Machine Learning models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        
        {/* Left Sidebar Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                ML Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Task Type</label>
                <select 
                  className="w-full text-sm p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                >
                  {taskOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Scenario</label>
                <select 
                  className="w-full text-sm p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                >
                  {scenarioOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Row Count</label>
                  <input 
                    type="number" 
                    className="text-xs font-mono bg-muted px-2 py-1 rounded w-24 text-right border"
                    min="100" max="10000000"
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value) || 100)}
                  />
                </div>
                <input 
                  type="range" 
                  className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" 
                  min="100" max="10000000" step="100"
                  value={rowCount}
                  onChange={(e) => setRowCount(parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Feature/Column Count</label>
                  <input 
                    type="number" 
                    className="text-xs font-mono bg-muted px-2 py-1 rounded w-24 text-right border"
                    min="1" max="1000"
                    placeholder="Auto"
                    value={columnCount}
                    onChange={(e) => setColumnCount(e.target.value ? parseInt(e.target.value) : "")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Region Localization</label>
                <select 
                  className="w-full text-sm p-2.5 border rounded-md bg-background focus:ring-1 focus:ring-primary focus:border-primary"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between">
                  <label className="text-sm font-semibold flex items-center gap-1">Noise Injection <Activity className="w-3 h-3 text-red-500"/></label>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{dirtyPercentage}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">Test model robustness by injecting missing values and outliers.</p>
                <input 
                  type="range" 
                  className="w-full accent-red-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer mt-2" 
                  min="0" max="30" step="1"
                  value={dirtyPercentage}
                  onChange={(e) => setDirtyPercentage(parseInt(e.target.value))}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full mt-4 gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md transition-all py-6 text-md"
              >
                {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
                Generate ML Data
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* Right Preview Area */}
        <div className="lg:col-span-3">
          {!jobData ? (
            <div className="h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 p-12 min-h-[500px]">
              <BrainCircuit className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground">Awaiting Configuration</h3>
              <p className="text-center max-w-sm mt-2">Configure your machine learning task on the left and click generate to build a synthetic dataset optimized with distinct class boundaries and correlations.</p>
            </div>
          ) : (
            <Card className="flex flex-col border-dashed shadow-sm">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Generated Dataset Preview</CardTitle>
                    <CardDescription className="mt-1">
                      Successfully built <b>{jobData.row_count}</b> rows for <b>{scenario}</b>.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button onClick={() => handleExport('csv')} variant="outline" size="sm" className="gap-2 bg-background hover:bg-muted">
                      <Download className="w-4 h-4 text-green-600" /> CSV
                    </Button>
                    <Button onClick={() => handleExport('excel')} variant="outline" size="sm" className="gap-2 bg-background hover:bg-muted">
                      <Download className="w-4 h-4 text-green-700" /> Excel
                    </Button>
                    <Button onClick={() => handleExport('parquet')} variant="outline" size="sm" className="gap-2 bg-background hover:bg-muted">
                      <Download className="w-4 h-4 text-purple-600" /> Parquet
                    </Button>
                    <Button onClick={() => setJobData(null)} variant="default" size="sm" className="ml-2">
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {Object.entries(jobData.preview).map(([tableName, rows]: [string, any]) => (
                    <div key={tableName} className="overflow-hidden">
                      <div className="bg-muted/50 px-4 py-2 font-medium flex justify-between items-center border-b text-sm">
                        <span className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-primary" /> {tableName} Table</span>
                        <span className="text-xs text-muted-foreground font-normal">Previewing first {rows.length} rows</span>
                      </div>
                      <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-background sticky top-0 border-b shadow-sm z-10">
                            <tr>
                              {Object.keys(rows[0] || {}).map(col => (
                                <th 
                                  key={col} 
                                  draggable
                                  onDragStart={() => setDraggedCol(col)}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={() => handleDrop(tableName, col)}
                                  className={`px-4 py-3 font-semibold text-foreground whitespace-nowrap cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-colors ${col.toLowerCase() === 'target' || col.toLowerCase() === 'churn' || col.toLowerCase() === 'price' ? 'bg-primary/5 text-primary hover:bg-primary/10' : ''}`}
                                  title="Drag to reorder"
                                >
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {rows.map((row: any, i: number) => (
                              <tr key={i} className="hover:bg-muted/30 transition-colors bg-background">
                                {Object.entries(row).map(([key, val]: [string, any], j: number) => (
                                  <td key={j} className={`px-4 py-2.5 whitespace-nowrap ${key.toLowerCase() === 'target' || key.toLowerCase() === 'churn' || key.toLowerCase() === 'price' ? 'font-medium text-primary bg-primary/5' : 'text-muted-foreground'}`}>{val?.toString() || 'null'}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
