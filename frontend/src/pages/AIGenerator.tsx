import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Table2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DatasetAPI } from "@/lib/api";

export default function AIGenerator() {
  const [searchParams] = useSearchParams();
  const prompt = searchParams.get("prompt") || "";
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggedCol, setDraggedCol] = useState<string | null>(null);

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

  useEffect(() => {
    if (prompt && !jobData && !isGenerating && !error) {
      generateDataset();
    }
  }, [prompt]);

  const generateDataset = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setJobData(null);
    setError(null);
    
    try {
      const result = await DatasetAPI.generateAI({ prompt });
      setJobData(result);
    } catch (err: any) {
      console.error("Failed to generate AI dataset", err);
      setError("Failed to generate dataset. Please try a different prompt or check backend status.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    if (!jobData?.job_id) return;
    try {
      await DatasetAPI.exportData(jobData.job_id, format, jobData.tables_generated?.length || 1);
    } catch (error) {
      console.error("Export error", error);
      alert("Failed to export dataset. Please ensure backend is reachable.");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" /> AI Dataset Generator
          </h1>
          <p className="text-muted-foreground mt-1">Generating datasets via Natural Language Processing.</p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Your Prompt</p>
              <p className="text-xl font-semibold mt-1">"{prompt}"</p>
            </div>
            {isGenerating && (
              <div className="flex items-center gap-3 text-primary bg-primary/10 px-4 py-2 rounded-full">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="font-medium animate-pulse">AI is parsing and generating...</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 text-destructive bg-destructive/10 px-4 py-2 rounded-full">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            )}
            {jobData && (
              <div className="flex items-center gap-3 text-green-600 bg-green-500/10 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Generation Complete</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {jobData && (
        <Card className="flex-1 flex flex-col overflow-hidden border-green-500/20">
          <CardHeader className="bg-muted/30 pb-4 shrink-0 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Table2 className="w-5 h-5 text-primary" /> Generated Preview
                </CardTitle>
                <CardDescription className="mt-1.5">
                  AI detected Domain: <span className="font-medium text-foreground">{jobData.domain}</span> | 
                  Region: <span className="font-medium text-foreground">{jobData.region}</span> | 
                  Rows: <span className="font-medium text-foreground">{jobData.row_count}</span>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                  <Download className="w-4 h-4 mr-2" /> CSV (Zip)
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('sql')}>
                  <Download className="w-4 h-4 mr-2" /> SQL
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                  <Download className="w-4 h-4 mr-2" /> JSON
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/50">
            {jobData.tables_generated?.map((table: string) => (
              <div key={table} className="p-4 border-b last:border-0">
                <h3 className="font-medium mb-3 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {table}
                </h3>
                <div className="rounded-md border bg-card overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground bg-muted/50 sticky top-0 backdrop-blur-sm shadow-sm">
                        <tr>
                          {jobData.preview[table]?.[0] && Object.keys(jobData.preview[table][0]).map(col => (
                            <th 
                              key={col} 
                              draggable
                              onDragStart={() => setDraggedCol(col)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDrop(table, col)}
                              className="px-4 py-3 font-medium border-b whitespace-nowrap cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-colors"
                              title="Drag to reorder"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {jobData.preview[table]?.slice(0, 5).map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            {Object.values(row).map((val: any, j: number) => (
                              <td key={j} className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">
                                {val !== null ? String(val) : <span className="text-muted-foreground/40 italic">null</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-muted/30 px-4 py-2 border-t text-xs text-muted-foreground flex justify-between">
                    <span>Showing 5 of {jobData.row_count} rows</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
