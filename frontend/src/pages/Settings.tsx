import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Key, Save, Database, Settings2, ShieldCheck, Palette } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('openaiKey') || "");
  const [anthropicKey, setAnthropicKey] = useState(localStorage.getItem('anthropicKey') || "");
  const [googleKey, setGoogleKey] = useState(localStorage.getItem('googleKey') || "");
  const [grokKey, setGrokKey] = useState(localStorage.getItem('grokKey') || "");
  const [groqKey, setGroqKey] = useState(localStorage.getItem('groqKey') || "");
  const [huggingfaceKey, setHuggingfaceKey] = useState(localStorage.getItem('huggingfaceKey') || "");
  const [defaultFormat, setDefaultFormat] = useState(localStorage.getItem('defaultFormat') || "csv");
  const [activeTab, setActiveTab] = useState("General");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const handleSave = () => {
    setIsSaving(true);
    
    // Save other keys to local storage for persistence
    localStorage.setItem('openaiKey', openaiKey);
    localStorage.setItem('anthropicKey', anthropicKey);
    localStorage.setItem('googleKey', googleKey);
    localStorage.setItem('grokKey', grokKey);
    localStorage.setItem('groqKey', groqKey);
    localStorage.setItem('huggingfaceKey', huggingfaceKey);
    localStorage.setItem('defaultFormat', defaultFormat);

    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your application preferences and API keys.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md">
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Left Nav */}
        <div className="flex flex-col gap-2">
          {[
            { id: 'General', label: 'General', icon: Settings2 },
            { id: 'API Keys', label: 'API Keys', icon: Key },
            { id: 'Appearance', label: 'Appearance', icon: Palette },
            { id: 'Export Defaults', label: 'Export Defaults', icon: Database }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <Button 
                key={tab.id}
                variant={isActive ? "secondary" : "ghost"} 
                className={`justify-start gap-3 w-full transition-colors ${isActive ? 'bg-primary/10 hover:bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-6">
          
          {(activeTab === "General" || activeTab === "Appearance") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" /> Appearance
              </CardTitle>
              <CardDescription>Customize how the application looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div 
                  className={`border-2 p-4 rounded-xl cursor-pointer flex-1 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun className="w-8 h-8 text-amber-500" />
                  <span className="font-medium">Light Mode</span>
                </div>
                <div 
                  className={`border-2 p-4 rounded-xl cursor-pointer flex-1 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon className="w-8 h-8 text-indigo-400" />
                  <span className="font-medium">Dark Mode</span>
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {(activeTab === "General" || activeTab === "API Keys") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" /> API Integrations
              </CardTitle>
              <CardDescription>Connect external AI providers for the AI Generator.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">OpenAI API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    placeholder="sk-..."
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={openaiKey}
                    onChange={e => setOpenaiKey(e.target.value)}
                  />
                  <Button variant="outline" className="gap-2 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-green-500" /> Verify
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Required for intelligent schema generation and data filling.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Anthropic (Claude) API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    placeholder="sk-ant-..."
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={anthropicKey}
                    onChange={e => setAnthropicKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Google (Gemini) API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    placeholder="AIza..."
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={googleKey}
                    onChange={e => setGoogleKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">xAI (Grok) API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    placeholder="xai-..."
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={grokKey}
                    onChange={e => setGrokKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Groq API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    placeholder="gsk_..."
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={groqKey}
                    onChange={e => setGroqKey(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hugging Face Token</label>
                <input 
                  type="password"
                  placeholder="hf_..."
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={huggingfaceKey}
                  onChange={e => setHuggingfaceKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Optional. Used for local open-source LLM generation.</p>
              </div>
            </CardContent>
          </Card>
          )}

          {(activeTab === "General" || activeTab === "Export Defaults") && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Data Export
              </CardTitle>
              <CardDescription>Set your default preferences for dataset generation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium block">Default Export Format</label>
                <div className="flex gap-3 flex-wrap">
                  {['csv', 'excel', 'json', 'sqlite', 'parquet'].map(format => (
                    <label key={format} className={`flex items-center gap-2 border px-3 py-2 rounded-md cursor-pointer transition-colors ${defaultFormat === format ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-muted'}`}>
                      <input 
                        type="radio" 
                        name="exportFormat" 
                        className="accent-primary" 
                        checked={defaultFormat === format}
                        onChange={() => setDefaultFormat(format)}
                      />
                      <span className="text-sm font-medium uppercase">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          )}

        </div>
      </div>
    </div>
  );
}
