import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-gold-gradient">404</h1>
        <h2 className="mt-4 text-xl font-medium">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-gold inline-flex rounded-full px-6 py-3 text-sm">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-gold rounded-full px-6 py-3 text-sm"
          >
            Try again
          </button>
          <a href="/" className="btn-outline-gold rounded-full px-6 py-3 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Appetito Club — Fine Dining & Lifestyle Destination in Greater Noida" },
      {
        name: "description",
        content:
          "Appetito Club is Greater Noida's premier fine dining destination — international cuisine, handcrafted mocktails, outdoor seating, private dining, pickleball and mini golf at Knowledge Park II.",
      },
      { name: "author", content: "Appetito Club" },
      { name: "theme-color", content: "#0B0B0B" },
      { property: "og:title", content: "Appetito Club — Fine Dining & Lifestyle Destination in Greater Noida" },
      {
        property: "og:description",
        content:
          "Appetito Club is Greater Noida's premier fine dining destination — international cuisine, handcrafted mocktails, outdoor seating, private dining, pickleball and mini golf at Knowledge Park II.",
      },
      { property: "og:type", content: "restaurant.restaurant" },
      { property: "og:site_name", content: "Appetito Club" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Appetito Club — Fine Dining & Lifestyle Destination in Greater Noida" },
      {
        name: "twitter:description",
        content: "Appetito Club is Greater Noida's premier fine dining destination — international cuisine, handcrafted mocktails, outdoor seating, private dining, pickleball and mini golf at Knowledge Park II.",
      },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a01722ef-51e5-4fff-965c-78a77ab731b1" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/a01722ef-51e5-4fff-965c-78a77ab731b1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Poppins:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Appetito Club",
          image: "/og-cover.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: "R3, Knowledge Park II",
            addressLocality: "Greater Noida",
            addressRegion: "Uttar Pradesh",
            postalCode: "201310",
            addressCountry: "IN",
          },
          telephone: "+91-8860023344",
          servesCuisine: ["International", "Italian", "Indian", "Pan Asian", "Lebanese"],
          priceRange: "₹₹₹",
          openingHours: "Mo-Su 11:00-22:30",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.5", reviewCount: "1800" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-center" richColors />
    </QueryClientProvider>
  );
}
