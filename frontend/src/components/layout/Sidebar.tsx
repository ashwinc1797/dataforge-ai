import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Database, 
  LayoutTemplate, 
  Network, 
  BrainCircuit, 
  Files, 
  Settings,
  LayoutDashboard
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Data Generator", path: "/generator", icon: Database },
  { name: "Templates", path: "/templates", icon: LayoutTemplate },
  { name: "Data Modeling", path: "/modeling", icon: Network },
  { name: "ML Dataset", path: "/ml-generator", icon: BrainCircuit },
  { name: "Generated Files", path: "/files", icon: Files },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="absolute top-0 left-0 flex h-full w-16 hover:w-64 flex-col border-r bg-card px-3 py-4 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl group z-50">
      <div className="mb-8 px-1 flex items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">DataForge <span className="text-primary">AI</span></h1>
      </div>
      
      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200 overflow-hidden",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-colors mx-1",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
              )} />
              <span className="ml-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t">
        <Link
          to="/settings"
          className={cn(
            "flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all overflow-hidden",
            location.pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0 mx-1" />
          <span className="ml-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
}
