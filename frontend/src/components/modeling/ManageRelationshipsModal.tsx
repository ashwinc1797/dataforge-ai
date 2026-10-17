import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Wand2, Edit3, Trash2, Filter } from "lucide-react";
import { Edge } from "reactflow";

interface ManageRelationshipsModalProps {
  edges: Edge[];
  nodes: any[];
  onClose: () => void;
  onNewRelationship: () => void;
  onEditRelationship: (edgeId: string) => void;
  onDeleteRelationships: (edgeIds: string[]) => void;
  onAutoDetect: () => void;
}

export default function ManageRelationshipsModal({
  edges,
  nodes,
  onClose,
  onNewRelationship,
  onEditRelationship,
  onDeleteRelationships,
  onAutoDetect
}: ManageRelationshipsModalProps) {
  const [selectedEdges, setSelectedEdges] = useState<Set<string>>(new Set());

  const toggleSelection = (edgeId: string) => {
    const newSet = new Set(selectedEdges);
    if (newSet.has(edgeId)) {
      newSet.delete(edgeId);
    } else {
      newSet.add(edgeId);
    }
    setSelectedEdges(newSet);
  };

  const toggleAll = () => {
    if (selectedEdges.size === edges.length) {
      setSelectedEdges(new Set());
    } else {
      setSelectedEdges(new Set(edges.map(e => e.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedEdges.size > 0) {
      onDeleteRelationships(Array.from(selectedEdges));
      setSelectedEdges(new Set());
    }
  };

  // Helper to get readable table and column name
  const getReadableEndpoint = (nodeId: string, handleId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    const tableName = node?.data?.name || nodeId;
    const colName = handleId ? handleId.replace('-source', '').replace('-target', '') : '';
    return `${tableName} (${colName})`;
  };

  const renderVisualRelationship = (edge: Edge) => {
    const cardinality = edge.data?.cardinality || '1:N';
    const crossFilter = edge.data?.crossFilter || 'Single';
    
    const [src, tgt] = cardinality.split(':').map((c: string) => c === 'N' ? '*' : c);
    
    return (
      <div className="flex items-center justify-center gap-1">
        <span className="font-bold text-xs bg-muted/50 px-1.5 py-0.5 rounded border">{src}</span>
        <span className="text-muted-foreground">―</span>
        <div className="bg-background border shadow-sm p-0.5 rounded flex items-center justify-center">
           {crossFilter === 'Both' ? '◀▶' : '◀'}
        </div>
        <span className="text-muted-foreground">―</span>
        <span className="font-bold text-xs bg-muted/50 px-1.5 py-0.5 rounded border">{tgt}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border shadow-2xl rounded-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="font-semibold text-xl">Manage relationships</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-4 border-b flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-3">
            <Button onClick={onNewRelationship} className="bg-[#0f7c68] hover:bg-[#0c6655] text-white gap-2">
              <Plus className="w-4 h-4" /> New relationship
            </Button>
            <Button onClick={onAutoDetect} variant="outline" className="gap-2">
              <Wand2 className="w-4 h-4" /> Autodetect
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2" 
              disabled={selectedEdges.size !== 1}
              onClick={() => onEditRelationship(Array.from(selectedEdges)[0])}
            >
              <Edit3 className="w-4 h-4" /> Edit
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              disabled={selectedEdges.size === 0}
              onClick={handleDeleteSelected}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
            <Button variant="ghost" className="gap-2 ml-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-background">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-background sticky top-0 border-b z-10">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    checked={edges.length > 0 && selectedEdges.size === edges.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[30%]">From: table (column) ↑</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[20%] text-center">Relationship</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-[30%]">To: table (column)</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {edges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No relationships defined. Click "Autodetect" or "New relationship" to create one.
                  </td>
                </tr>
              ) : (
                edges.map((edge) => {
                  const isSelected = selectedEdges.has(edge.id);
                  const isActive = edge.data?.isActive ?? true;
                  
                  return (
                    <tr 
                      key={edge.id} 
                      className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelection(edge.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-foreground truncate max-w-xs" title={getReadableEndpoint(edge.source, edge.sourceHandle!)}>
                        {getReadableEndpoint(edge.source, edge.sourceHandle!)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {renderVisualRelationship(edge)}
                      </td>
                      <td className="px-4 py-3 text-foreground truncate max-w-xs" title={getReadableEndpoint(edge.target, edge.targetHandle!)}>
                        {getReadableEndpoint(edge.target, edge.targetHandle!)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-foreground">{isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEditRelationship(edge.id)}>
                          <span className="text-lg leading-none mt-[-8px]">...</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t bg-background flex justify-end">
          <Button onClick={onClose} className="bg-[#0f7c68] hover:bg-[#0c6655] text-white px-8">Close</Button>
        </div>
      </div>
    </div>
  );
}
