import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Sparkles } from "lucide-react";

export default function Header() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && prompt.trim().length > 0) {
      navigate(`/ai-generator?prompt=${encodeURIComponent(prompt.trim())}`);
      setPrompt("");
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between items-center">
        <div className="flex items-center gap-2">
          {/* AI Search/Prompt Bar */}
          <div className="relative group hidden md:block">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-card rounded-lg border px-3 py-1.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Generate with AI (e.g. 'Retail data for US...')" 
                className="bg-transparent border-none focus:outline-none text-sm w-80 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          <div className="flex items-center gap-x-4">
            <button type="button" className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-foreground hover:bg-accent p-1.5 rounded-full transition-colors">
              <span className="sr-only">Your profile</span>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="h-4 w-4 text-primary" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
