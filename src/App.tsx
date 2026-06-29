import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Todos from "./pages/Todos";
import ClientProfile from "./pages/ClientProfile";
import PreMeeting from "./pages/PreMeeting";
import LiveMeeting from "./pages/LiveMeeting";
import PostMeeting from "./pages/PostMeeting";

function NotFound() {
  return <div className="p-8 text-center text-gray-500">404 — Page not found</div>;
}

function AnimatedRouter() {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (location !== displayLocation) {
      setAnimating(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDisplayLocation(location);
        setAnimating(true);
      }, 10);
    }
  }, [location]);

  return (
    <div key={displayLocation} className={animating ? "page-enter" : ""}>
      <Switch location={displayLocation}>
        <Route path="/" component={Home} />
        <Route path="/clients" component={Clients} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/todos" component={Todos} />
        <Route path="/client/:id" component={ClientProfile} />
        <Route path="/pre-meeting/:id" component={PreMeeting} />
        <Route path="/meeting/:id" component={LiveMeeting} />
        <Route path="/post-meeting/:id" component={PostMeeting} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <AnimatedRouter />
    </TooltipProvider>
  );
}
