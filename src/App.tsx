import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Route, Switch } from "wouter";
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
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}
