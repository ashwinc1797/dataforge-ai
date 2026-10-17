import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, Wand2, Download, Table2, MapPin, Hash, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DatasetAPI } from "@/lib/api";

const domains = ["Retail", "Ecommerce", "Healthcare", "Banking", "Insurance", "HR", "Education", "Telecom", "Manufacturing", "Logistics", "Real Estate", "Hospitality", "Finance", "Marketing"];
const regions = ["India", "USA", "UK", "Canada", "Australia", "UAE", "Singapore", "Germany"];
const sizes = [100, 500, 1000, 5000, 10000, 50000, 100000, 1000000, 10000000];

export default function Generator() {
  const [domain, setDomain] = useState("Retail");
  const [region, setRegion] = useState("India");
  const [size, setSize] = useState(1000);
  const [columnCount, setColumnCount] = useState<number | "">("");
  const [dirtyPct, setDirtyPct] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  const navigate = useNavigate();

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
      const initial = await DatasetAPI.generate({
        domain,
        region,
        row_count: size,
        column_count: columnCount === "" ? undefined : columnCount,
        dirty_percentage: dirtyPct,
        include_all_tables: true,
      });
      
      const jobId = initial.job_id;
      
      const poll = setInterval(async () => {
        try {
          const statusResult = await DatasetAPI.getStatus(jobId);
          if (statusResult.status === "completed") {
             clearInterval(poll);
             setJobData(statusResult);
             setIsGenerating(false);
          } else if (statusResult.status === "failed") {
             clearInterval(poll);
             setIsGenerating(false);
             alert("Generation failed on backend: " + statusResult.error);
          }
        } catch (e) {
          clearInterval(poll);
          setIsGenerating(false);
          console.error("Polling error", e);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Failed to generate dataset", error);
      alert("Failed to generate dataset. Is the backend running?");
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    if (!jobData?.job_id) return;
    
    try {
      // For real download, we can use fetch and create object URL, or simply window.location
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
      const url = `${baseUrl}/export/`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobData.job_id, format })
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `dataset_${jobData.job_id}.${format === 'excel' ? 'xlsx' : format === 'sqlite' ? 'db' : format === 'json' || format === 'parquet' || format === 'csv' ? format === 'csv' && jobData.tables_generated.length > 1 ? 'zip' : format : 'sql'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Export error", error);
      alert("Failed to export dataset");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DataForge AI</h1>
          <p className="text-muted-foreground mt-1">Configure and generate realistic business datasets in seconds.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/modeling')} className="gap-2">
            <Settings2 className="w-4 h-4" /> Advanced
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md">
            {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Generate Dataset"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Config */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/10 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-purple-600"></div>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Set the base parameters for your dataset.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-primary" /> Business Domain
                </label>
                <select 
                  value={domain} 
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Region / Locale
                </label>
                <select 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" /> Row Count
                </label>
                <select 
                  value={size} 
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {sizes.map(s => <option key={s} value={s}>{s.toLocaleString()} records</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-primary" /> Column Count (Optional)
                </label>
                <input 
                  type="number"
                  min="1" max="1000"
                  placeholder="Leave empty for schema defaults"
                  value={columnCount}
                  onChange={(e) => setColumnCount(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" /> Dirty Data
                  </span>
                  <span className="text-muted-foreground">{dirtyPct}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={dirtyPct} 
                  onChange={(e) => setDirtyPct(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <p className="text-xs text-muted-foreground">Injects missing values, duplicates, and typos to simulate real-world data.</p>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Output */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full min-h-[400px] flex flex-col border-dashed bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Dataset Preview</CardTitle>
                  <CardDescription>
                    {jobData ? `Generated ${jobData.tables_generated.length} tables with ${jobData.row_count} rows.` : 'Click generate to see your configured dataset here.'}
                  </CardDescription>
                </div>
                {/* Export Buttons */}
                {jobData && (
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button onClick={() => handleExport('csv')} variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" /> CSV
                    </Button>
                    <Button onClick={() => handleExport('excel')} variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" /> Excel
                    </Button>
                    <Button onClick={() => handleExport('json')} variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" /> JSON
                    </Button>
                    <Button onClick={() => handleExport('sqlite')} variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" /> SQLite
                    </Button>
                    <Button onClick={() => handleExport('sql')} variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" /> SQL
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {!jobData ? (
                <div className="flex-1 flex items-center justify-center text-center space-y-3 opacity-50 my-12">
                  <div>
                    <Table2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">No data generated yet</p>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">Configure your parameters on the left and click "Generate Dataset" to preview the results.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Quality Score Banner */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-medium text-green-900 dark:text-green-100">Quality Score: {jobData.quality_report.quality_score}/100</h4>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          {jobData.quality_report.issues.length} issues found. Missing: {jobData.quality_report.missing_value_percentage}%, Duplicates: {jobData.quality_report.duplicate_row_percentage}%. 
                          {jobData.quality_report.date_format_issues > 0 && ` Date Errors: ${jobData.quality_report.date_format_issues}.`}
                          {jobData.quality_report.text_format_issues > 0 && ` Format/Typo Errors: ${jobData.quality_report.text_format_issues}.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Table Previews */}
                  <div className="space-y-4">
                    {Object.entries(jobData.preview).map(([tableName, rows]: [string, any]) => (
                      <div key={tableName} className="border rounded-md overflow-hidden">
                        <div className="bg-muted px-4 py-2 font-medium flex justify-between items-center border-b">
                          <span>{tableName}</span>
                          <span className="text-xs text-muted-foreground font-normal">Previewing first {rows.length} rows</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 border-b">
                              <tr>
                                {Object.keys(rows[0] || {}).map(col => (
                                  <th 
                                    key={col} 
                                    draggable
                                    onDragStart={() => setDraggedCol(col)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(tableName, col)}
                                    className="px-4 py-2 font-medium text-muted-foreground whitespace-nowrap cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-colors"
                                    title="Drag to reorder"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row: any, i: number) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                                  {Object.values(row).map((val: any, j: number) => (
                                    <td key={j} className="px-4 py-2 whitespace-nowrap">{val?.toString() || 'null'}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
