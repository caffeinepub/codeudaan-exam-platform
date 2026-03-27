import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/pages/AdminPage";
import ExamPage from "@/pages/ExamPage";
import ResultPage from "@/pages/ResultPage";
import StartPage from "@/pages/StartPage";
import TerminatePage from "@/pages/TerminatePage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="bottom-right" theme="dark" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: StartPage,
});

const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exam",
  component: ExamPage,
});

const resultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/result",
  component: ResultPage,
});

const terminateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terminate",
  component: TerminatePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  examRoute,
  resultRoute,
  terminateRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
