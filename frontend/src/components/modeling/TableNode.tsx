import { Handle, Position } from "reactflow";
import { Key, Plus, Settings2 } from "lucide-react";
import { useState } from "react";

export default function TableNode({ data }: { data: any }) {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const handleSaveColumn = () => {
    if (newColumnName.trim() && data.onAddColumn) {
      data.onAddColumn(data.name, newColumnName.trim());
    }
    setIsAddingColumn(false);
    setNewColumnName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveColumn();
    if (e.key === 'Escape') {
      setIsAddingColumn(false);
      setNewColumnName("");
    }
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col min-w-[200px]">
      {/* Node Header */}
      <div className="bg-muted px-4 py-2 border-b flex justify-between items-center cursor-grab active:cursor-grabbing">
        <span className="font-semibold text-sm flex items-center gap-2">
          {data.name}
          <Settings2 
            className="w-3.5 h-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" 
            onClick={() => data.onEditTable && data.onEditTable(data.name)}
          />
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${data.type === 'Fact' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
          {data.type}
        </span>
      </div>

      {/* Node Body (Columns) */}
      <div className="p-3 bg-background">
        <ul className="space-y-2">
          {data.columns.map((col: any, index: number) => {
            const colName = typeof col === 'string' ? col : (col?.name || `col_${index}`);
            const isPK = typeof col === 'object' ? !!col?.pk : colName.includes('(PK)');
            const isFK = colName.includes('(FK)');
            const cleanName = colName.replace('(PK)', '').replace('(FK)', '').trim();
            const colId = typeof col === 'object' && col?.id ? col.id : cleanName;

            return (
              <li key={colId} className="text-xs text-muted-foreground flex items-center justify-between relative group">
                <div className="flex items-center gap-2">
                  {isPK ? <Key className="w-3 h-3 text-yellow-500" /> : isFK ? <Key className="w-3 h-3 text-blue-400" /> : <div className="w-3 h-3" />}
                  <span className={isPK || isFK ? 'font-medium text-foreground' : ''}>
                    {cleanName}
                  </span>
                </div>
                
                {/* Standard visible handles that are slightly larger for easy connecting */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${cleanName}-source`}
                  className="w-3 h-3 bg-blue-500 hover:bg-blue-600 transition-colors cursor-crosshair -right-1.5"
                />
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${cleanName}-target`}
                  className="w-3 h-3 bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-crosshair -left-1.5"
                />
              </li>
            );
          })}
        </ul>
        
        {/* Inline Add Column */}
        {isAddingColumn ? (
          <div className="mt-3 pt-2 border-t border-dashed px-1">
            <input 
              autoFocus
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveColumn}
              className="w-full text-xs p-1.5 border rounded-md bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Column name..."
            />
          </div>
        ) : (
          <div 
            className="mt-3 pt-2 border-t border-dashed flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors"
            onClick={() => setIsAddingColumn(true)}
          >
            <Plus className="w-3 h-3" />
            <span>Add Column</span>
          </div>
        )}
      </div>
    </div>
  );
}
