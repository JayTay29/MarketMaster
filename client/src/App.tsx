import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Templates from "@/pages/Templates";
import Editor from "@/pages/Editor";
import Navbar from "@/components/Navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/templates/:category" component={Templates} />
      <Route path="/editor/:id?" component={Editor} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isEditorPage = location.startsWith("/editor");
  
  return (
    <QueryClientProvider client={queryClient}>
      {isEditorPage ? (
        // Editor page doesn't use the sidebar for maximum workspace
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Router />
          </div>
          <Toaster />
        </div>
      ) : (
        // Regular pages use the sidebar navigation
        <Navbar>
          <Router />
        </Navbar>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
