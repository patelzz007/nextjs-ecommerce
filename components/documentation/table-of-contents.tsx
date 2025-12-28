"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
   id: string;
   title: string;
   level: number;
}

export function TableOfContents() {
   const [toc, setToc] = useState<TocItem[]>([]);
   const [activeId, setActiveId] = useState<string>("");

   useEffect(() => {
      // Extract headings from the page
      const headings = Array.from(document.querySelectorAll("h2, h3"));
      const items: TocItem[] = headings.map((heading) => ({
         id: heading.id,
         title: heading.textContent || "",
         level: Number.parseInt(heading.tagName.charAt(1)),
      }));
      setToc(items);

      // Track active heading
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  setActiveId(entry.target.id);
               }
            });
         },
         { rootMargin: "-80px 0px -80% 0px" }
      );

      headings.forEach((heading) => observer.observe(heading));

      return () => observer.disconnect();
   }, []);

   if (toc.length === 0) return null;

   return (
      <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 overflow-y-auto border-l border-slate-200 bg-slate-50/50 p-6 backdrop-blur-sm">
         <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
               <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
               </svg>
               <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">On this page</h3>
            </div>
            <nav>
               <ul className="space-y-1">
                  {toc.map((item, idx) => (
                     <li
                        key={item.id ? `${item.id}-${idx}` : `toc-item-${idx}`}
                        style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
                     >
                        <a
                           href={`#${item.id}`}
                           className={cn(
                              "group flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-white hover:shadow-sm",
                              activeId === item.id
                                 ? "bg-white font-semibold text-indigo-600 shadow-sm border-l-2 border-indigo-600 -ml-0.5"
                                 : "text-slate-600 hover:text-slate-900 border-l-2 border-transparent -ml-0.5"
                           )}
                        >
                           {activeId === item.id && (
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                           )}
                           <span className="leading-relaxed">{item.title}</span>
                        </a>
                     </li>
                  ))}
               </ul>
            </nav>
         </div>
      </aside>
   );
}
