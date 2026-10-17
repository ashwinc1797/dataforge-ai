import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EdgeEditorModalProps {
  edge: any;
  nodes: any[];
  onSave: (edgeId: string, payload: any) => void;
  onDelete: (edgeId: string) => void;
  onClose: () => void;
}

export default function EdgeEditorModal({ edge, nodes, onSave, onDelete, onClose }: EdgeEditorModalProps) {
  // Extract initial values from edge
  const [sourceTable, setSourceTable] = useState(edge.source);
  const [targetTable, setTargetTable] = useState(edge.target);
  
  const [sourceColumn, setSourceColumn] = useState(edge.sourceHandle?.replace('-source', '') || "");
  const [targetColumn, setTargetColumn] = useState(edge.targetHandle?.replace('-target', '') || "");
  
  const [cardinality, setCardinality] = useState(edge.data?.cardinality || "N:1");
  const [crossFilter, setCrossFilter] = useState(edge.data?.crossFilter || "Single");
  const [isActive, setIsActive] = useState(edge.data?.isActive ?? true);

  // Auto-select first column if none selected on table change
  useEffect(() => {
    const sNode = nodes.find(n => n.id === sourceTable);
    if (sNode && !sNode.data.columns.find((c: any) => getColName(c) === sourceColumn)) {
      setSourceColumn(getColName(sNode.data.columns[0]));
    }
  }, [sourceTable]);

  useEffect(() => {
    const tNode = nodes.find(n => n.id === targetTable);
    if (tNode && !tNode.data.columns.find((c: any) => getColName(c) === targetColumn)) {
      setTargetColumn(getColName(tNode.data.columns[0]));
    }
  }, [targetTable]);

  const handleSave = () => {
    onSave(edge.id, {
      source: sourceTable,
      target: targetTable,
      sourceHandle: `${sourceColumn}-source`,
      targetHandle: `${targetColumn}-target`,
      data: {
        ...edge.data,
        cardinality,
        crossFilter,
        isActive
      }
    });
  };

  const getColName = (col: any) => {
    const name = typeof col === 'string' ? col : (col?.name || "");
    return name.replace('(PK)', '').replace('(FK)', '').trim();
  };

  // Renders a Power BI style data grid preview
  const renderTableGrid = (tableId: string, selectedCol: string, setCol: (c: string) => void) => {
    const node = nodes.find(n => n.id === tableId);
    if (!node) return <div className="p-4 border text-muted-foreground text-sm">Table not found</div>;
    
    const cols = node.data.columns.map((c: any) => getColName(c));
    
    // Mock 3 rows of data
    const mockRows = [1, 2, 3];

    return (
      <div className="border rounded-md overflow-x-auto bg-background custom-scrollbar shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              {cols.map((col: string) => (
                <th 
                  key={col} 
                  onClick={() => setCol(col)}
                  className={`px-4 py-2 font-medium border-b border-r last:border-r-0 cursor-pointer transition-colors ${
                    selectedCol === col ? 'bg-primary/10 border-b-primary border-b-2 text-primary' : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockRows.map(rowIdx => (
              <tr key={rowIdx} className="border-b last:border-0">
                {cols.map((col: string) => (
                  <td 
                    key={col} 
                    onClick={() => setCol(col)}
                    className={`px-4 py-2 border-r last:border-r-0 cursor-pointer whitespace-nowrap ${
                      selectedCol === col ? 'bg-primary/5 text-foreground' : 'text-muted-foreground hover:bg-muted/30'
                    }`}
                  >
                    {selectedCol === col ? `value_${rowIdx}` : 'null'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border shadow-2xl rounded-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b bg-muted/20">
          <div>
            <h2 className="font-semibold text-xl">Edit relationship</h2>
            <p className="text-sm text-muted-foreground">Select tables and columns that are related.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* From Table */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">From table</label>
            <select 
              value={sourceTable} 
              onChange={e => setSourceTable(e.target.value)}
              className="w-1/2 p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            >
              {nodes.map(n => <option key={n.id} value={n.id}>{n.data.name}</option>)}
            </select>
            <div className="mt-2">
              {renderTableGrid(sourceTable, sourceColumn, setSourceColumn)}
            </div>
          </div>

          {/* To Table */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">To table</label>
            <select 
              value={targetTable} 
              onChange={e => setTargetTable(e.target.value)}
              className="w-1/2 p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            >
              {nodes.map(n => <option key={n.id} value={n.id}>{n.data.name}</option>)}
            </select>
            <div className="mt-2">
              {renderTableGrid(targetTable, targetColumn, setTargetColumn)}
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Cardinality</label>
                <select 
                  value={cardinality} 
                  onChange={e => setCardinality(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="1:1">One to one (1:1)</option>
                  <option value="1:N">One to many (1:*)</option>
                  <option value="N:1">Many to one (*:1)</option>
                  <option value="N:N">Many to many (*:*)</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm cursor-pointer">Make this relationship active</label>
              </div>

              <div className="flex items-center gap-2 opacity-50">
                <input 
                  type="checkbox" 
                  disabled
                  id="assumeRI"
                  className="w-4 h-4 rounded border-gray-300 text-primary"
                />
                <label htmlFor="assumeRI" className="text-sm cursor-not-allowed">Assume referential integrity</label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Cross-filter direction</label>
                <select 
                  value={crossFilter} 
                  onChange={e => setCrossFilter(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                >
                  <option value="Single">Single</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="flex items-center gap-2 opacity-50 pt-[1.6rem]">
                <input 
                  type="checkbox" 
                  disabled
                  className="w-4 h-4 rounded border-gray-300 text-primary"
                />
                <label className="text-sm cursor-not-allowed">Apply security filter in both directions</label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t bg-muted/10 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-6">Cancel</Button>
          <Button onClick={handleSave} className="px-6 bg-[#0f7c68] hover:bg-[#0c6655] text-white shadow-md">Save</Button>
        </div>
      </div>
    </div>
  );
}
