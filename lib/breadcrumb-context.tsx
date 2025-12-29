"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import adminMenu from "@/data/admin-menu.json";

interface BreadcrumbItem {
   id: string;
   title: string;
   href: string;
   icon?: string;
}

interface BreadcrumbContextType {
   breadcrumbs: BreadcrumbItem[];
   setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
   pageTitle: string;
   pageDescription: string;
   setPageInfo: (title: string, description: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Helper function to find menu item by path
function findMenuItemByPath(path: string, items: any[]): any {
   for (const item of items) {
      if (item.url === path) return item;

      if (item.children) {
         const found = findMenuItemByPath(path, item.children);
         if (found) return found;
      }
   }
   return null;
}

// Helper function to build breadcrumb trail
function buildBreadcrumbTrail(path: string): BreadcrumbItem[] {
   const breadcrumbs: BreadcrumbItem[] = [
      { id: "dashboard", title: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
   ];

   // If we're on the dashboard, return just that
   if (path === "/admin") {
      return breadcrumbs;
   }

   // Collect all menu items
   const allItems: any[] = [];
   adminMenu.sections.forEach((section) => {
      allItems.push(...section.items);
   });
   allItems.push(...adminMenu.bottomItems);

   // Recursive function to find path and build trail
   function findTrail(items: any[], targetPath: string, trail: BreadcrumbItem[] = []): BreadcrumbItem[] | null {
      for (const item of items) {
         const currentTrail = [
            ...trail,
            {
               id: item.id || item.title.toLowerCase().replace(/\s+/g, "-"),
               title: item.title,
               href: item.url,
               icon: item.icon,
            },
         ];

         if (item.url === targetPath) return currentTrail;

         if (item.children) {
            const found = findTrail(item.children, targetPath, currentTrail);
            if (found) return found;
         }
      }
      return null;
   }

   const trail = findTrail(allItems, path);
   if (trail) return [breadcrumbs[0], ...trail];

   // Fallback: generate breadcrumbs from URL segments
   const segments = path.split("/").filter(Boolean);
   segments.forEach((segment, index) => {
      const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;
      const label = segment
         .split("-")
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
         .join(" ");

      breadcrumbs.push({ id: segment, title: label, href: segmentPath });
   });

   return breadcrumbs;
}

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
   const pathname = usePathname();
   const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
   const [pageTitle, setPageTitle] = useState("");
   const [pageDescription, setPageDescription] = useState("");

   // Auto-generate breadcrumbs based on pathname
   useEffect(() => {
      const generatedBreadcrumbs = buildBreadcrumbTrail(pathname);
      setBreadcrumbs(generatedBreadcrumbs);

      // Auto-set page title from last breadcrumb
      if (generatedBreadcrumbs.length > 0) {
         const lastCrumb = generatedBreadcrumbs[generatedBreadcrumbs.length - 1];
         setPageTitle(lastCrumb.title);
      }
   }, [pathname]);

   const setPageInfo = (title: string, description: string) => {
      setPageTitle(title);
      setPageDescription(description);
   };

   return (
      <BreadcrumbContext.Provider
         value={{
            breadcrumbs,
            setBreadcrumbs,
            pageTitle,
            pageDescription,
            setPageInfo,
         }}
      >
         {children}
      </BreadcrumbContext.Provider>
   );
}

export function useBreadcrumb() {
   const context = useContext(BreadcrumbContext);
   if (!context) throw new Error("useBreadcrumb must be used within BreadcrumbProvider");

   return context;
}
