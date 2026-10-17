import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Save, Plus, Settings2, Trash2, Key } from "lucide-react";

export type ColumnDef = {
  id: string;
  name: string;
  datatype: string;
  pk: boolean;
  nn: boolean;
  uq: boolean;
  ai: boolean;
  defaultVal: string;
};

interface TableEditorModalProps {
  tableData: any;
  onSave: (tableName: string, newTableData: any) => void;
  onClose: () => void;
}

const DATATYPES = ["INT", "VARCHAR(45)", "VARCHAR(255)", "DECIMAL(10,2)", "DATE", "DATETIME", "BOOLEAN", "TEXT", "UUID"];

export default function TableEditorModal({ tableData, onSave, onClose }: TableEditorModalProps) {
  const [tableName, setTableName] = useState(tableData.name);
  const [rowCount, setRowCount] = useState<number | "">(tableData.rowCount || "");
  const [columns, setColumns] = useState<ColumnDef[]>(tableData.columns.map((c: any, i: number) => {
    if (typeof c === 'string') {
      return { id: `legacy_${i}`, name: c.replace('(PK)','').replace('(FK)','').trim(), datatype: "VARCHAR(255)", pk: c.includes('(PK)'), nn: false, uq: false, ai: false, defaultVal: "" };
    }
    return c;
  }));

  const handleAddRow = () => {
    setColumns([
      ...columns,
      { id: Date.now().toString(), name: "new_column", datatype: "VARCHAR(45)", pk: false, nn: false, uq: false, ai: false, defaultVal: "" }
    ]);
  };

  const updateColumn = (id: string, field: keyof ColumnDef, value: any) => {
    setColumns(cols => cols.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeColumn = (id: string) => {
    setColumns(cols => cols.filter(c => c.id !== id));
  };

  const handleSave = () => {
    onSave(tableData.name, { ...tableData, name: tableName, columns, rowCount: rowCount === "" ? undefined : rowCount });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border shadow-xl rounded-xl w-full max-w-5xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Table Configuration</h2>
              <p className="text-sm text-muted-foreground">Configure structure, datatypes, and constraints.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Top Info Section */}
          <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
            <label className="text-sm font-semibold text-right pr-4">Table Name:</label>
            <input 
              className="border rounded-md px-3 py-1.5 text-sm bg-background w-full max-w-sm" 
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />

            <label className="text-sm font-semibold text-right pr-4">Charset/Collation:</label>
            <div className="flex gap-2 w-full max-w-sm">
              <select className="border rounded-md px-3 py-1.5 text-sm bg-background flex-1">
                <option>utf8mb4</option>
              </select>
              <select className="border rounded-md px-3 py-1.5 text-sm bg-background flex-1">
                <option>utf8mb4_0900_ai_ci</option>
              </select>
            </div>

            <label className="text-sm font-semibold text-right pr-4">Row Count (Override):</label>
            <input 
              type="number"
              className="border rounded-md px-3 py-1.5 text-sm bg-background w-full max-w-sm" 
              value={rowCount}
              onChange={(e) => setRowCount(e.target.value ? parseInt(e.target.value) : "")}
              placeholder="Leave empty to use global row count"
              min="1"
            />

            <label className="text-sm font-semibold text-right pr-4 self-start mt-2">Comments:</label>
            <textarea className="border rounded-md px-3 py-2 text-sm bg-background w-full max-w-lg h-20 resize-none"></textarea>
          </div>

          {/* Detailed Grid */}
          <div className="border rounded-md overflow-hidden bg-muted/20">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="px-3 py-2 font-medium w-8"></th>
                    <th className="px-3 py-2 font-medium">Column Name</th>
                    <th className="px-3 py-2 font-medium">Datatype</th>
                    <th className="px-2 py-2 font-medium text-center" title="Primary Key">PK</th>
                    <th className="px-2 py-2 font-medium text-center" title="Not Null">NN</th>
                    <th className="px-2 py-2 font-medium text-center" title="Unique">UQ</th>
                    <th className="px-2 py-2 font-medium text-center" title="Auto Increment">AI</th>
                    <th className="px-3 py-2 font-medium">Default/Expression</th>
                    <th className="px-3 py-2 font-medium w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {columns.map((col, i) => (
                    <tr key={col.id} className="bg-background hover:bg-muted/30 group">
                      <td className="px-3 py-1.5 text-center">
                        {col.pk ? <Key className="w-3.5 h-3.5 text-yellow-500 mx-auto" /> : <div className="w-3.5 h-3.5 border border-muted-foreground/30 rotate-45 mx-auto rounded-sm"></div>}
                      </td>
                      <td className="px-1 py-1">
                        <input 
                          className="w-full px-2 py-1 text-sm border-transparent focus:border-border hover:border-border bg-transparent focus:bg-background rounded" 
                          value={col.name}
                          onChange={(e) => updateColumn(col.id, "name", e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-1">
                        <select 
                          className="w-full px-2 py-1 text-sm border-transparent focus:border-border hover:border-border bg-transparent focus:bg-background rounded appearance-none cursor-pointer"
                          value={col.datatype}
                          onChange={(e) => updateColumn(col.id, "datatype", e.target.value)}
                        >
                          {DATATYPES.map(dt => <option key={dt}>{dt}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input type="checkbox" checked={col.pk} onChange={(e) => updateColumn(col.id, "pk", e.target.checked)} className="accent-primary w-3.5 h-3.5" />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input type="checkbox" checked={col.nn} onChange={(e) => updateColumn(col.id, "nn", e.target.checked)} className="accent-primary w-3.5 h-3.5" />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input type="checkbox" checked={col.uq} onChange={(e) => updateColumn(col.id, "uq", e.target.checked)} className="accent-primary w-3.5 h-3.5" />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <input type="checkbox" checked={col.ai} onChange={(e) => updateColumn(col.id, "ai", e.target.checked)} className="accent-primary w-3.5 h-3.5" />
                      </td>
                      <td className="px-1 py-1">
                        <input 
                          className="w-full px-2 py-1 text-sm border-transparent focus:border-border hover:border-border bg-transparent focus:bg-background rounded" 
                          value={col.defaultVal}
                          onChange={(e) => updateColumn(col.id, "defaultVal", e.target.value)}
                          placeholder="NULL"
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <button onClick={() => removeColumn(col.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-500/10 rounded transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-muted px-4 py-2 border-t">
              <Button onClick={handleAddRow} variant="ghost" size="sm" className="h-7 text-xs gap-1 -ml-2">
                <Plus className="w-3 h-3" /> Add Column
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
