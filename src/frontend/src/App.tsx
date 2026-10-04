import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ContactPage from "./pages/ContactPage";
import DocumentsPage from "./pages/DocumentsPage";
import HomePage from "./pages/HomePage";

// Create root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  ),
});

// Create index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

// Create documents route
const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents",
  component: DocumentsPage,
});

// Create contact route
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  documentsRoute,
  contactRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
