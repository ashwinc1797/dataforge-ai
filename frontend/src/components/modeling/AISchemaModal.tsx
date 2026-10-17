import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, KeyRound, ArrowUp, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface AISchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (schema: any) => void;
}

const InlineSelect = ({ value, onChange, options }: any) => (
  <select 
    value={value} 
    onChange={e => onChange(e.target.value)}
    className="mx-1.5 px-3 py-1 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-md border border-border/50 outline-none focus:ring-2 focus:ring-primary inline-block appearance-none cursor-pointer text-base shadow-sm transition-colors"
    style={{ 
      paddingRight: '1.75rem', 
      backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")', 
      backgroundPosition: 'right 0.35rem center', 
      backgroundRepeat: 'no-repeat', 
      backgroundSize: '1.2em 1.2em' 
    }}
  >
    {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
  </select>
);

export function AISchemaModal({ isOpen, onClose, onGenerate }: AISchemaModalProps) {
  const navigate = useNavigate();
  
  const [rows, setRows] = useState("100");
  const [business, setBusiness] = useState("B2B SaaS");
  const [schemaType, setSchemaType] = useState("One Big Table (OBT)");
  const [year, setYear] = useState("2025");
  const [growth, setGrowth] = useState("steady");
  const [variation, setVariation] = useState("medium");
  const [granularity, setGranularity] = useState("daily");
  const [provider, setProvider] = useState<"openai" | "anthropic" | "google" | "grok" | "groq">("openai");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const getActiveKey = () => {
    switch (provider) {
      case "openai": return localStorage.getItem("openaiKey") || "";
      case "anthropic": return localStorage.getItem("anthropicKey") || "";
      case "google": return localStorage.getItem("googleKey") || "";
      case "grok": return localStorage.getItem("grokKey") || "";
      case "groq": return localStorage.getItem("groqKey") || "";
      default: return "";
    }
  };

  const activeKey = getActiveKey();

  const handleGenerate = async () => {
    const prompt = `I want to generate a ${rows} row dataset for a ${business} business, using ${schemaType}, covering ${year} with ${growth} growth, ${variation} variation, and ${granularity} granularity. Please design a comprehensive and realistic database schema for this.`;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await api.post("/schema-ai/generate", {
        prompt,
        provider,
        api_key: activeKey
      });
      
      onGenerate(response.data);
      onClose();
    } catch (err: any) {
      let errorMessage = "Failed to generate schema";
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        errorMessage = detail[0].msg || "Validation error";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="relative bg-card text-card-foreground w-full max-w-3xl mx-4 rounded-xl shadow-xl border border-primary/20 p-6 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1.5 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4"
            onClick={onClose}
            disabled={isGenerating}
          >
            <X className="w-4 h-4" />
          </Button>
          <h2 className="flex items-center gap-2 font-semibold tracking-tight text-xl">
            <Wand2 className="w-5 h-5 text-purple-500" />
            AI Schema Generator
          </h2>
          <p className="text-sm text-muted-foreground">
            Use our natural language builder to precisely define your schema architecture.
          </p>
        </div>
        
        <div className="py-2">
          <label className="text-sm font-medium mb-1.5 block">AI Provider</label>
          <select 
            className="w-full p-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            disabled={isGenerating}
          >
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="anthropic">Anthropic (Claude 3.5)</option>
            <option value="google">Google (Gemini 1.5)</option>
            <option value="grok">xAI (Grok)</option>
            <option value="groq">Groq (Llama 3)</option>
          </select>
        </div>

        {!activeKey ? (
          <div className="bg-amber-500/10 border border-amber-500/50 rounded-md p-4 flex flex-col items-center justify-center text-center gap-3 mt-4">
            <KeyRound className="w-8 h-8 text-amber-500" />
            <div>
              <h4 className="font-semibold text-amber-600 dark:text-amber-500">API Key Required</h4>
              <p className="text-sm text-muted-foreground mt-1">You need to configure your {provider} API Key in Settings to use this provider.</p>
            </div>
            <Button variant="outline" className="mt-2" onClick={() => navigate("/settings")}>
              Go to Settings
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4 mt-2">
            <div className="p-6 bg-background/50 border rounded-xl shadow-sm text-lg leading-relaxed text-card-foreground">
              I want to generate a 
              <InlineSelect 
                value={rows} 
                onChange={setRows} 
                options={["100", "1,000", "10,000", "100,000", "1,000,000"]} 
              /> 
              row dataset for a 
              <InlineSelect 
                value={business} 
                onChange={setBusiness} 
                options={["B2B SaaS", "E-Commerce", "Healthcare", "Fintech", "Retail", "Logistics", "Education"]} 
              /> 
              business, using 
              <InlineSelect 
                value={schemaType} 
                onChange={setSchemaType} 
                options={["One Big Table (OBT)", "Star Schema", "Snowflake Schema", "3NF Relational"]} 
              />
              , covering 
              <InlineSelect 
                value={year} 
                onChange={setYear} 
                options={["2025", "2024", "2023", "2020-2025", "2015-2025"]} 
              /> 
              with 
              <InlineSelect 
                value={growth} 
                onChange={setGrowth} 
                options={["steady", "exponential", "flat", "seasonal"]} 
              /> 
              growth, 
              <InlineSelect 
                value={variation} 
                onChange={setVariation} 
                options={["medium", "low", "high", "extreme"]} 
              /> 
              variation, and 
              <InlineSelect 
                value={granularity} 
                onChange={setGranularity} 
                options={["daily", "hourly", "weekly", "monthly"]} 
              /> 
              granularity.
            </div>
            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-500/10 p-3 rounded-md">{error}</p>
            )}
          </div>
        )}
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>Cancel</Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!activeKey || isGenerating}
            className="gap-2 bg-[#4c8df6] hover:bg-[#3a75d1] text-white shadow-md border-0 px-6 mb-2 sm:mb-0"
          >
            {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUp className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
