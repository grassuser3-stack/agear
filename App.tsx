// NIC — App Router
// Design: Warm Intelligence — navy authority, cream warmth, indigo AI

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Todos from "./pages/Todos";
import ClientProfile from "./pages/ClientProfile";
import PreMeeting from "./pages/PreMeeting";
import LiveMeeting from "./pages/LiveMeeting";
import PostMeeting from "./pages/PostMeeting";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/clients" component={Clients} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/todos" component={Todos} />
      <Route path="/client/:id" component={ClientProfile} />
      <Route path="/pre-meeting/:id" component={PreMeeting} />
      <Route path="/meeting/:id" component={LiveMeeting} />
      <Route path="/post-meeting/:id" component={PostMeeting} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
