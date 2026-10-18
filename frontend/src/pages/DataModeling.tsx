import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactFlow, { Background, Controls, MiniMap, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection, Edge, ConnectionMode } from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Database, Key, TableProperties, Plus, Save, Wand2, Download, Settings2 } from "lucide-react";
import { DatasetAPI } from "@/lib/api";
import TableNode from "@/components/modeling/TableNode";
import TableEditorModal from "@/components/modeling/TableEditorModal";
import RelationEdge from "@/components/modeling/RelationEdge";
import EdgeEditorModal from "@/components/modeling/EdgeEditorModal";
import { AISchemaModal } from "@/components/modeling/AISchemaModal";
import ManageRelationshipsModal from "@/components/modeling/ManageRelationshipsModal";

const domains = ["Retail", "Ecommerce", "Healthcare", "Banking", "Insurance", "HR", "Education", "Telecom", "Manufacturing", "Logistics", "Real Estate", "Hospitality", "Finance", "Marketing"];
const regions = ["India", "USA", "UK", "Canada", "Australia", "UAE", "Singapore", "Germany"];
const sizes = [100, 500, 1000, 5000, 10000, 50000, 100000, 1000000, 10000000];

const nodeTypes = {
  tableNode: TableNode,
};

const edgeTypes = {
  relationEdge: RelationEdge,
};

const getDomainSchema = (domain: string) => {
  const d = domain.toLowerCase();
  
  if (d === 'retail' || d === 'ecommerce') {
    return {
      nodes: [
        { id: "Customers", type: "tableNode", position: { x: 50, y: 50 }, data: { name: "Customers", type: "Dimension", columns: [{ id: "c1", name: "CustomerID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "c2", name: "Name", datatype: "VARCHAR(255)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "c3", name: "Email", datatype: "VARCHAR(255)", pk: false, nn: false, uq: true, ai: false, defaultVal: "" }] } },
        { id: "Products", type: "tableNode", position: { x: 50, y: 250 }, data: { name: "Products", type: "Dimension", columns: [{ id: "p1", name: "ProductID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "p2", name: "ProductName", datatype: "VARCHAR(255)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "p3", name: "Price", datatype: "DECIMAL(10,2)", pk: false, nn: true, uq: false, ai: false, defaultVal: "0.00" }] } },
        { id: "Orders", type: "tableNode", position: { x: 350, y: 150 }, data: { name: "Orders", type: "Fact", columns: [{ id: "o1", name: "OrderID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "o2", name: "CustomerID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o3", name: "ProductID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o4", name: "TotalAmount", datatype: "DECIMAL(10,2)", pk: false, nn: true, uq: false, ai: false, defaultVal: "0.00" }] } },
        { id: "Stores", type: "tableNode", position: { x: 50, y: 450 }, data: { name: "Stores", type: "Dimension", columns: [{ id: "s1", name: "StoreID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "s2", name: "Location", datatype: "VARCHAR(255)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
        { id: "Inventory", type: "tableNode", position: { x: 350, y: 350 }, data: { name: "Inventory", type: "Fact", columns: [{ id: "i1", name: "InventoryID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "i2", name: "ProductID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "i3", name: "StoreID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "i4", name: "StockCount", datatype: "INT", pk: false, nn: true, uq: false, ai: false, defaultVal: "0" }] } }
      ],
      edges: [
        { id: "e-cust-ord", source: "Customers", target: "Orders", sourceHandle: "CustomerID-source", targetHandle: "CustomerID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-prod-ord", source: "Products", target: "Orders", sourceHandle: "ProductID-source", targetHandle: "ProductID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-prod-inv", source: "Products", target: "Inventory", sourceHandle: "ProductID-source", targetHandle: "ProductID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-stor-inv", source: "Stores", target: "Inventory", sourceHandle: "StoreID-source", targetHandle: "StoreID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } }
      ]
    };
  }

  if (d === 'healthcare') {
    return {
      nodes: [
        { id: "Patients", type: "tableNode", position: { x: 50, y: 50 }, data: { name: "Patients", type: "Dimension", columns: [{ id: "c1", name: "PatientID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "c2", name: "Name", datatype: "VARCHAR(255)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
        { id: "Doctors", type: "tableNode", position: { x: 50, y: 250 }, data: { name: "Doctors", type: "Dimension", columns: [{ id: "p1", name: "DoctorID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "p2", name: "Specialty", datatype: "VARCHAR(100)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
        { id: "Appointments", type: "tableNode", position: { x: 350, y: 150 }, data: { name: "Appointments", type: "Fact", columns: [{ id: "o1", name: "AppointmentID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "o2", name: "PatientID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o3", name: "DoctorID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o4", name: "Date", datatype: "DATETIME", pk: false, nn: true, uq: false, ai: false, defaultVal: "CURRENT_TIMESTAMP" }] } },
        { id: "Departments", type: "tableNode", position: { x: -200, y: 250 }, data: { name: "Departments", type: "Dimension", columns: [{ id: "d1", name: "DepartmentID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "d2", name: "DeptName", datatype: "VARCHAR(100)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
        { id: "Treatments", type: "tableNode", position: { x: 650, y: 150 }, data: { name: "Treatments", type: "Fact", columns: [{ id: "t1", name: "TreatmentID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "t2", name: "AppointmentID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "t3", name: "Cost", datatype: "DECIMAL(10,2)", pk: false, nn: true, uq: false, ai: false, defaultVal: "0.00" }] } }
      ],
      edges: [
        { id: "e-pat-app", source: "Patients", target: "Appointments", sourceHandle: "PatientID-source", targetHandle: "PatientID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-doc-app", source: "Doctors", target: "Appointments", sourceHandle: "DoctorID-source", targetHandle: "DoctorID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-dep-doc", source: "Departments", target: "Doctors", sourceHandle: "DepartmentID-source", targetHandle: "DepartmentID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-app-trt", source: "Appointments", target: "Treatments", sourceHandle: "AppointmentID-source", targetHandle: "AppointmentID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } }
      ]
    };
  }

  if (d === 'banking' || d === 'finance') {
    return {
      nodes: [
        { id: "Customers", type: "tableNode", position: { x: 50, y: 50 }, data: { name: "Customers", type: "Dimension", columns: [{ id: "c1", name: "CustomerID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "c2", name: "Name", datatype: "VARCHAR(255)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
        { id: "Accounts", type: "tableNode", position: { x: 50, y: 250 }, data: { name: "Accounts", type: "Dimension", columns: [{ id: "a1", name: "AccountID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "a2", name: "CustomerID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "a3", name: "Balance", datatype: "DECIMAL(10,2)", pk: false, nn: true, uq: false, ai: false, defaultVal: "0.00" }] } },
        { id: "Transactions", type: "tableNode", position: { x: 350, y: 150 }, data: { name: "Transactions", type: "Fact", columns: [{ id: "o1", name: "TransactionID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "o2", name: "AccountID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o3", name: "Amount", datatype: "DECIMAL(10,2)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o4", name: "Timestamp", datatype: "DATETIME", pk: false, nn: true, uq: false, ai: false, defaultVal: "CURRENT_TIMESTAMP" }] } },
        { id: "Branches", type: "tableNode", position: { x: -200, y: 250 }, data: { name: "Branches", type: "Dimension", columns: [{ id: "b1", name: "BranchID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "b2", name: "City", datatype: "VARCHAR(100)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
        { id: "Loans", type: "tableNode", position: { x: 350, y: -50 }, data: { name: "Loans", type: "Dimension", columns: [{ id: "l1", name: "LoanID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "l2", name: "CustomerID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "l3", name: "LoanAmount", datatype: "DECIMAL(10,2)", pk: false, nn: true, uq: false, ai: false, defaultVal: "0.00" }] } }
      ],
      edges: [
        { id: "e-cust-acc", source: "Customers", target: "Accounts", sourceHandle: "CustomerID-source", targetHandle: "CustomerID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-acc-txn", source: "Accounts", target: "Transactions", sourceHandle: "AccountID-source", targetHandle: "AccountID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-bra-acc", source: "Branches", target: "Accounts", sourceHandle: "BranchID-source", targetHandle: "BranchID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
        { id: "e-cust-loa", source: "Customers", target: "Loans", sourceHandle: "CustomerID-source", targetHandle: "CustomerID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } }
      ]
    };
  }

  // Generic fallback
  return {
    nodes: [
      { id: `${domain}Users`, type: "tableNode", position: { x: 50, y: 50 }, data: { name: `${domain}Users`, type: "Dimension", columns: [{ id: "c1", name: "UserID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "c2", name: "Name", datatype: "VARCHAR(255)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
      { id: `${domain}Items`, type: "tableNode", position: { x: 50, y: 250 }, data: { name: `${domain}Items`, type: "Dimension", columns: [{ id: "p1", name: "ItemID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "p2", name: "Description", datatype: "VARCHAR(255)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
      { id: `${domain}Events`, type: "tableNode", position: { x: 350, y: 150 }, data: { name: `${domain}Events`, type: "Fact", columns: [{ id: "o1", name: "EventID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "o2", name: "UserID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o3", name: "ItemID (FK)", datatype: "UUID", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }, { id: "o4", name: "Timestamp", datatype: "DATETIME", pk: false, nn: true, uq: false, ai: false, defaultVal: "CURRENT_TIMESTAMP" }] } },
      { id: `${domain}Categories`, type: "tableNode", position: { x: -200, y: 250 }, data: { name: `${domain}Categories`, type: "Dimension", columns: [{ id: "cat1", name: "CategoryID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "cat2", name: "CategoryName", datatype: "VARCHAR(100)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } },
      { id: `${domain}Locations`, type: "tableNode", position: { x: -200, y: 50 }, data: { name: `${domain}Locations`, type: "Dimension", columns: [{ id: "loc1", name: "LocationID", datatype: "UUID", pk: true, nn: true, uq: true, ai: false, defaultVal: "" }, { id: "loc2", name: "City", datatype: "VARCHAR(100)", pk: false, nn: true, uq: false, ai: false, defaultVal: "" }] } }
    ],
    edges: [
      { id: "e-user-event", source: `${domain}Users`, target: `${domain}Events`, sourceHandle: "UserID-source", targetHandle: "UserID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
      { id: "e-item-event", source: `${domain}Items`, target: `${domain}Events`, sourceHandle: "ItemID-source", targetHandle: "ItemID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
      { id: "e-cat-item", source: `${domain}Categories`, target: `${domain}Items`, sourceHandle: "CategoryID-source", targetHandle: "CategoryID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } },
      { id: "e-loc-user", source: `${domain}Locations`, target: `${domain}Users`, sourceHandle: "LocationID-source", targetHandle: "LocationID-target", type: "relationEdge", animated: true, style: { stroke: '#3b82f6' }, data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' } }
    ]
  };
};

export default function DataModeling() {
  const location = useLocation();
  const initialDomain = location.state?.domain || "Retail";
  const defaultSchema = getDomainSchema(initialDomain);
  const [nodes, setNodes] = useState<any[]>(defaultSchema.nodes);
  const [edges, setEdges] = useState<Edge[]>(defaultSchema.edges as Edge[]);
  
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editingEdge, setEditingEdge] = useState<string | null>(null);
  const [pendingEdge, setPendingEdge] = useState<Edge | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [edgeContextMenu, setEdgeContextMenu] = useState<{ edge: any, x: number, y: number } | null>(null);
  const [isManagingRelationships, setIsManagingRelationships] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobData, setJobData] = useState<any>(null);

  const [domain, setDomain] = useState(initialDomain);
  const [region, setRegion] = useState("India");
  const [size, setSize] = useState(location.state?.autoGenerateSize || 1000);
  const [dirtyPct, setDirtyPct] = useState(0);

  // Expose a ref to handleGenerate so useEffect can call the latest version
  const handleGenerateRef = React.useRef<() => void>();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  useEffect(() => {
    const handleClickOutside = () => setEdgeContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      setEdgeContextMenu({
        edge,
        x: event.clientX,
        y: event.clientY,
      });
    },
    []
  );
  
  const handleEditEdge = useCallback((id: string) => {
    setEditingEdge(id);
  }, []);

  useEffect(() => {
    // Save the ref
    handleGenerateRef.current = handleGenerate;
  });

  useEffect(() => {
    if (location.state?.autoGenerate) {
      // Clear the state so it doesn't infinite loop on reload
      window.history.replaceState({}, '');
      
      // Auto-trigger generation
      setTimeout(() => {
        if (handleGenerateRef.current) {
          handleGenerateRef.current();
        }
      }, 300);
    }
  }, [location.state?.autoGenerate]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = { 
        ...connection, 
        id: `e-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: "relationEdge",
        animated: true, 
        style: { stroke: '#3b82f6' },
        data: { cardinality: '1:N', isActive: true, crossFilter: 'Single' }
      } as Edge;
      
      setPendingEdge(newEdge);
    },
    []
  );

  const handleSaveEdge = (edgeId: string, payload: any) => {
    setEdges(eds => {
      const newEdges = eds.map(e => e.id === edgeId ? { ...e, ...payload } : e);
      const savedEdge = newEdges.find(e => e.id === edgeId);
      
      if (savedEdge?.data?.isActive) {
        const pair = [savedEdge.source, savedEdge.target].sort().join('-');
        return newEdges.map(e => {
          if (e.id !== edgeId && (e.data?.isActive ?? true)) {
            const ePair = [e.source, e.target].sort().join('-');
            if (ePair === pair) {
               return { ...e, data: { ...e.data, isActive: false } };
            }
          }
          return e;
        });
      }
      return newEdges;
    });
    setEditingEdge(null);
  };

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges(eds => eds.filter(e => e.id !== edgeId));
    setEditingEdge(null);
  }, [setEdges]);

  const handleDeleteEdges = (edgeIds: string[]) => {
    setEdges(eds => eds.filter(e => !edgeIds.includes(e.id)));
  };

  const handleAISchemaGenerate = (schemaData: any) => {
    const newNodes: any[] = [];
    const newEdges: Edge[] = [];
    
    let x = 50;
    let y = 50;
    
    schemaData.tables.forEach((table: any, idx: number) => {
      newNodes.push({
        id: table.name,
        type: "tableNode",
        position: { x, y },
        data: {
          name: table.name,
          type: table.type,
          columns: table.columns.map((c: any) => ({
            id: `${table.name}-${c.name}-${Math.random().toString(36).substr(2, 5)}`,
            name: c.name,
            datatype: c.datatype,
            pk: c.pk,
            nn: c.nn,
            uq: c.uq,
            ai: c.ai,
            defaultVal: c.defaultVal
          }))
        }
      });
      
      x += 320;
      if ((idx + 1) % 3 === 0) {
        x = 50;
        y += 280;
      }
    });
    
    schemaData.relationships.forEach((rel: any) => {
      newEdges.push({
        id: `e-${rel.source}-${rel.target}-${Math.random().toString(36).substr(2, 5)}`,
        source: rel.source,
        target: rel.target,
        sourceHandle: rel.sourceHandle,
        targetHandle: rel.targetHandle,
        type: "relationEdge",
        animated: true,
        style: { stroke: '#3b82f6' },
        data: { cardinality: rel.cardinality, isActive: true, crossFilter: 'Single' }
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleNewRelationship = () => {
    const dummyId = `new-edge-${Date.now()}`;
    const newEdge = {
      id: dummyId,
      source: nodes[0]?.id || "",
      target: nodes[1]?.id || "",
      sourceHandle: `${nodes[0]?.data.columns[0]?.name?.replace('(PK)','').replace('(FK)','').trim()}-source` || "",
      targetHandle: `${nodes[1]?.data.columns[0]?.name?.replace('(PK)','').replace('(FK)','').trim()}-target` || "",
      type: "relationEdge",
      animated: true,
      style: { stroke: '#3b82f6' },
      data: { cardinality: '1:N', crossFilter: 'Single', isActive: true }
    };
    
    setEdges(eds => {
      const pair = [newEdge.source, newEdge.target].sort().join('-');
      const updatedEdges = eds.map(e => {
        const ePair = [e.source, e.target].sort().join('-');
        if (ePair === pair && (e.data?.isActive ?? true)) {
          return { ...e, data: { ...e.data, isActive: false } };
        }
        return e;
      });
      return [...updatedEdges, newEdge as Edge];
    });
    setEditingEdge(dummyId);
  };

  const handleAutoDetect = () => {
    let newEdgesAdded = 0;
    const newEdges: Edge[] = [];
    const currentEdgeKeys = new Set(edges.map(e => `${e.source}-${e.target}-${e.sourceHandle}-${e.targetHandle}`));
    const activePairs = new Set(
      edges.filter(e => (e.data?.isActive ?? true)).map(e => [e.source, e.target].sort().join('-'))
    );

    nodes.forEach(sourceNode => {
      sourceNode.data.columns.forEach((sourceCol: any) => {
        const sourceColName = typeof sourceCol === 'string' ? sourceCol : (sourceCol?.name || "");
        const sourceCleanName = sourceColName.replace('(PK)', '').replace('(FK)', '').trim();
        const isSourceFact = sourceNode.data.type === 'Fact';
        const isSourcePK = sourceColName.includes('(PK)');
        const isSourceFK = sourceColName.includes('(FK)');

        nodes.forEach(targetNode => {
          if (sourceNode.id === targetNode.id) return;

          targetNode.data.columns.forEach((targetCol: any) => {
            const targetColName = typeof targetCol === 'string' ? targetCol : (targetCol?.name || "");
            const targetCleanName = targetColName.replace('(PK)', '').replace('(FK)', '').trim();
            const isTargetFact = targetNode.data.type === 'Fact';
            const isTargetPK = targetColName.includes('(PK)');
            const isTargetFK = targetColName.includes('(FK)');

            if (sourceCleanName.toLowerCase() === targetCleanName.toLowerCase() && sourceCleanName.toLowerCase() !== "id") {
              
              const edgeKey1 = `${sourceNode.id}-${targetNode.id}-${sourceCleanName}-source-${targetCleanName}-target`;
              const edgeKey2 = `${targetNode.id}-${sourceNode.id}-${targetCleanName}-source-${sourceCleanName}-target`;
              
              if (!currentEdgeKeys.has(edgeKey1) && !currentEdgeKeys.has(edgeKey2)) {
                let srcCard = '1';
                let tgtCard = 'N';
                
                if (isSourceFact || isSourceFK) { srcCard = 'N'; tgtCard = '1'; }
                if (isTargetFact || isTargetFK) { tgtCard = 'N'; srcCard = '1'; }
                
                const pair = [sourceNode.id, targetNode.id].sort().join('-');
                const isActive = !activePairs.has(pair);
                if (isActive) {
                  activePairs.add(pair);
                }

                const newEdge: Edge = {
                  id: `e-auto-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  source: sourceNode.id,
                  target: targetNode.id,
                  sourceHandle: `${sourceCleanName}-source`,
                  targetHandle: `${targetCleanName}-target`,
                  type: "relationEdge",
                  animated: true,
                  style: { stroke: '#3b82f6' },
                  data: { cardinality: `${srcCard}:${tgtCard}`, crossFilter: 'Single', isActive }
                };
                
                newEdges.push(newEdge);
                currentEdgeKeys.add(edgeKey1);
                newEdgesAdded++;
              }
            }
          });
        });
      });
    });

    if (newEdgesAdded > 0) {
      setEdges(eds => [...eds, ...newEdges]);
      alert(`Autodetect found and created ${newEdgesAdded} new relationship(s).`);
    } else {
      alert("Autodetect did not find any new relationships based on column names.");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setJobData(null);
    try {
      const mappedTables = nodes.map(node => ({
        name: node.data.name,
        include: true,
        row_count: node.data.rowCount || null,
        custom_columns: node.data.columns.map((c: any) => {
          let type = "Text";
          const colName = typeof c === 'string' ? c : (c?.name || '');
          const datatype = typeof c === 'object' && c?.datatype ? c.datatype : "";

          if (datatype.includes('DATE') || datatype.includes('DATETIME')) type = "Date";
          else if (datatype.includes('DECIMAL')) type = "Currency";
          else if (datatype.includes('INT')) type = "Integer";
          else if (datatype.includes('BOOLEAN')) type = "Boolean";
          else if (datatype.includes('UUID')) type = "UUID";
          else if (colName.toLowerCase().includes('email')) type = "Email";
          else if (colName.toLowerCase().includes('id') && !datatype) type = "UUID";
          else if (colName.toLowerCase().includes('date') && !datatype) type = "Date";
          else if ((colName.toLowerCase().includes('price') || colName.toLowerCase().includes('amount')) && !datatype) type = "Currency";
          else if (colName.toLowerCase().includes('quantity') && !datatype) type = "Integer";
          
          return { name: colName.replace(' (PK)', '').replace(' (FK)', '').trim(), type: type };
        })
      }));

      const result = await DatasetAPI.generate({
        domain: domain,
        region: region,
        row_count: size,
        dirty_percentage: dirtyPct,
        tables: mappedTables,
        include_all_tables: false,
      });
      setJobData(result);
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate from schema.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTable = () => {
    const tableNumber = nodes.filter(n => n.id.startsWith("NewTable")).length + 1;
    const tableName = `NewTable_${tableNumber}`;
    
    const newNode = {
      id: tableName,
      type: "tableNode",
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: { 
        name: tableName, 
        type: "Dimension",
        columns: [{ id: Date.now().toString(), name: `id`, datatype: "INT", pk: true, nn: true, uq: true, ai: true, defaultVal: "" }]
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSaveModal = (oldName: string, newTableData: any) => {
    setNodes(nds => nds.map(n => n.id === oldName ? {
      ...n,
      id: newTableData.name,
      data: newTableData
    } : n));
    setEditingTable(null);
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

  const nodesWithActions = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onEditTable: (tableName: string) => setEditingTable(tableName),
      onAddColumn: (tableName: string, colName: string) => {
        if (!colName) return;
        setNodes(nds => nds.map(n => n.id === tableName ? {
          ...n,
          data: { 
             ...n.data, 
             columns: [...n.data.columns, { id: Date.now().toString(), name: colName, datatype: "VARCHAR(255)", pk: false, nn: false, uq: false, ai: false, defaultVal: "" }] 
          }
        } : n));
      }
    }
  }));

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Modeling</h1>
          <p className="text-muted-foreground mt-1">Design relational schemas visually with foreign keys and constraints.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsManagingRelationships(true)} variant="outline" className="gap-2">
            <Network className="w-4 h-4" /> Manage Relationships
          </Button>
          <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" /> Save Schema
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating} className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md">
            {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />}
            Generate Dataset
          </Button>
        </div>
      </div>

      {!jobData ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[600px]">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schema Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button 
                    onClick={() => setIsAIModalOpen(true)} 
                    className="w-full justify-start gap-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:bg-gradient-to-l hover:scale-[1.02] text-white border-0 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 ease-in-out px-4 py-6 rounded-xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -skew-x-12 -translate-x-full transition-transform duration-700 ease-out z-0"></div>
                    <Wand2 className="w-5 h-5 relative z-10 animate-pulse" /> 
                    <span className="font-semibold text-base relative z-10">AI Generate Schema</span>
                  </Button>
                  <Button onClick={handleAddTable} variant="secondary" className="w-full justify-start gap-2">
                    <Database className="w-4 h-4" /> New Table Node
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4 block">
                    * To configure a table's datatypes or rename it, click the <Settings2 className="w-3 h-3 inline-block" /> gear icon on the node.
                    <br/><br/>
                    * You can quickly add columns directly from inside the table nodes using the <Plus className="w-3 h-3 inline-block" /> button at the bottom.
                    <br/><br/>
                    * To add relationships, drag the invisible connection points from the side of a column to another table's column.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground block">Business Domain</label>
                  <select 
                    value={domain} onChange={e => {
                      const newDomain = e.target.value;
                      if (window.confirm("Changing the domain will replace your current schema canvas with a new template. Continue?")) {
                        setDomain(newDomain);
                        const newSchema = getDomainSchema(newDomain);
                        setNodes(newSchema.nodes);
                        setEdges(newSchema.edges as Edge[]);
                      }
                    }}
                    className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground block">Region / Locale</label>
                  <select 
                    value={region} onChange={e => setRegion(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-muted-foreground block">Row Count</label>
                  <div className="flex items-center gap-2">
                    <select 
                      value={size} onChange={e => setSize(Number(e.target.value))}
                      className="w-full p-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {sizes.map(s => <option key={s} value={s}>{s.toLocaleString()} records</option>)}
                    </select>
                  </div>
                  <input 
                    type="range" min={100} max={10000000} step={100}
                    value={size} onChange={e => setSize(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground">Dirty Data</label>
                    <span className="text-sm font-medium">{dirtyPct}%</span>
                  </div>
                  <input 
                    type="range" min={0} max={100} step={1}
                    value={dirtyPct} onChange={e => setDirtyPct(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 h-full border rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 relative shadow-inner">
            <ReactFlow
              nodes={nodesWithActions}
              edges={edges.map(e => ({ ...e, data: { ...e.data, onEdit: handleEditEdge, onDelete: handleDeleteEdge } }))}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgeContextMenu={handleEdgeContextMenu}
              connectionMode={ConnectionMode.Loose}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              className="bg-dot-pattern"
            >
              <Background color="#94a3b8" gap={20} size={1} />
              <Controls className="!bg-card !border-border !shadow-md" />
              <MiniMap 
                nodeStrokeColor="#3b82f6" 
                nodeColor={(node: any) => node.data?.type === 'Fact' ? '#f3e8ff' : '#dbeafe'}
                maskColor="rgba(0,0,0, 0.1)"
                className="!bg-card !border-border"
              />
            </ReactFlow>

            <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-10">
               <div className="px-3 py-1 bg-background border rounded-md text-xs font-medium flex items-center gap-1 shadow-sm">
                 <Network className="w-3 h-3 text-primary" /> {edges.length} Relationships
               </div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="flex flex-col border-dashed bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Schema Dataset</CardTitle>
                <CardDescription>
                  Successfully built {jobData.tables_generated.length} modeled tables.
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <Button onClick={() => handleExport('csv')} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" /> CSV
                </Button>
                <Button onClick={() => handleExport('excel')} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" /> Excel
                </Button>
                <Button onClick={() => handleExport('sqlite')} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" /> SQLite
                </Button>
                <Button onClick={() => setJobData(null)} variant="default" size="sm" className="gap-2">
                  Back to Editor
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(jobData.preview).map(([tableName, rows]: [string, any]) => (
                <div key={tableName} className="border rounded-md overflow-hidden bg-background">
                  <div className="bg-muted px-4 py-2 font-medium flex justify-between items-center border-b">
                    <span>{tableName}</span>
                    <span className="text-xs text-muted-foreground font-normal">Previewing first {rows.length} rows</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          {Object.keys(rows[0] || {}).map(col => (
                            <th key={col} className="px-4 py-2 font-medium text-muted-foreground whitespace-nowrap">{col}</th>
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
          </CardContent>
        </Card>
      )}

      {editingTable && (
        <TableEditorModal 
          tableData={nodes.find(n => n.id === editingTable)?.data} 
          onSave={handleSaveModal}
          onClose={() => setEditingTable(null)} 
        />
      )}

      {editingEdge && (
        <EdgeEditorModal 
          edge={edges.find(e => e.id === editingEdge)} 
          nodes={nodes}
          onSave={handleSaveEdge}
          onDelete={handleDeleteEdge}
          onClose={() => setEditingEdge(null)} 
        />
      )}

      {/* Edge Editor Modal for Creating (Pending Drag-and-Drop) */}
      {pendingEdge && (
        <EdgeEditorModal 
          edge={pendingEdge} 
          nodes={nodes}
          onSave={(edgeId, payload) => {
            setEdges(eds => {
              const pair = [payload.source, payload.target].sort().join('-');
              let updatedEdges = eds;
              if (payload.data?.isActive) {
                 updatedEdges = eds.map(e => {
                   const ePair = [e.source, e.target].sort().join('-');
                   if (ePair === pair && (e.data?.isActive ?? true)) {
                     return { ...e, data: { ...e.data, isActive: false } };
                   }
                   return e;
                 });
              }
              const newAddedEdge = { ...pendingEdge, ...payload };
              return addEdge(newAddedEdge, updatedEdges);
            });
            setPendingEdge(null);
          }}
          onDelete={() => setPendingEdge(null)}
          onClose={() => setPendingEdge(null)} 
        />
      )}

      {/* Manage Relationships Modal */}
      {isManagingRelationships && (
        <ManageRelationshipsModal
          edges={edges}
          nodes={nodes}
          onClose={() => setIsManagingRelationships(false)}
          onNewRelationship={handleNewRelationship}
          onEditRelationship={handleEditEdge}
          onDeleteRelationships={handleDeleteEdges}
          onAutoDetect={handleAutoDetect}
        />
      )}

      {/* Global Edge Context Menu */}
      {edgeContextMenu && (
        <div
          style={{ top: edgeContextMenu.y, left: edgeContextMenu.x }}
          className="fixed z-[100] bg-popover text-popover-foreground rounded-md border shadow-xl min-w-[150px] py-1 text-sm font-medium"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div 
            className="px-3 py-2 cursor-pointer hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEdge(edgeContextMenu.edge.id);
              setEdgeContextMenu(null);
            }}
          >
            Delete
          </div>
          <div 
            className="px-3 py-2 cursor-pointer hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              handleEditEdge(edgeContextMenu.edge.id);
              setEdgeContextMenu(null);
            }}
          >
            Properties
          </div>
        </div>
      )}
      
      <AISchemaModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        onGenerate={handleAISchemaGenerate} 
      />
    </div>
  );
}
