"use client";

import type React from "react";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Languages {
   label: string;
   value: string;
   code: string;
}

interface CodeBlockProps {
   code: string;
   language: string;
   languages?: Languages[];
}

interface Token {
   type: string;
   value: string;
}

function tokenize(code: string, language: string): Token[] {
   const tokens: Token[] = [];
   let remaining = code;

   const patterns: Record<string, RegExp[]> = {
      javascript: [
         /^(const|let|var|function|async|await|return|if|else|for|while|switch|case|break|continue|import|export|from|default|class|extends|new|this|try|catch|throw|typeof|instanceof)\b/,
         /^(["'`])(?:\\.|(?!\1).)*?\1/,
         /^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/,
         /^\/\/.*/,
         /^\d+/,
      ],
      python: [
         /^(import|from|def|class|if|elif|else|for|while|return|try|except|finally|with|as|pass|break|continue|True|False|None)\b/,
         /^(["'])(?:\\.|(?!\1).)*?\1/,
         /^([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/,
         /^#.*/,
         /^\d+/,
      ],
      bash: [
         /^(curl|wget|npm|yarn|git|docker|ssh|cd|ls|mkdir|rm|cp|mv|cat|grep|echo|export)\b/,
         /^(["'])(?:\\.|(?!\1).)*?\1/,
         /^\s-[a-zA-Z]\b/,
         /^#.*/,
      ],
      json: [/^"[^"]+"\s*:/, /^:\s*"[^"]+"/, /^:\s*\d+/, /^(true|false|null)\b/],
   };

   const langPatterns = patterns[language] || patterns.javascript;

   while (remaining.length > 0) {
      let matched = false;

      for (const pattern of langPatterns) {
         const match = remaining.match(pattern);
         if (match) {
            const value = match[0];
            let type = "default";

            if (pattern.source.includes("const|let|var|function") || pattern.source.includes("import|from|def")) {
               type = "keyword";
            } else if (pattern.source.includes("[\"'`]") || pattern.source.includes("[\"'']")) {
               type = "string";
            } else if (pattern.source.includes("\\(")) {
               type = "function";
            } else if (pattern.source.includes("//") || pattern.source.includes("#")) {
               type = "comment";
            } else if (pattern.source.includes("\\d")) {
               type = "number";
            }

            tokens.push({ type, value });
            remaining = remaining.slice(value.length);
            matched = true;
            break;
         }
      }

      if (!matched) {
         tokens.push({ type: "default", value: remaining[0] });
         remaining = remaining.slice(1);
      }
   }

   return tokens;
}

function HighlightedCode({ code, language }: { code: string; language: string }) {
   const tokens = tokenize(code, language);

   return (
      <>
         {tokens.map((token, i) => {
            const style: React.CSSProperties = {};

            switch (token.type) {
               case "keyword":
                  style.color = "#c678dd";
                  break;
               case "string":
                  style.color = "#98c379";
                  break;
               case "function":
                  style.color = "#61afef";
                  break;
               case "number":
                  style.color = "#d19a66";
                  break;
               case "comment":
                  style.color = "#5c6370";
                  style.fontStyle = "italic";
                  break;
               default:
                  style.color = "#abb2bf";
            }

            return (
               <span key={i} style={style}>
                  {token.value}
               </span>
            );
         })}
      </>
   );
}

export function CodeBlock({ code, language, languages }: CodeBlockProps) {
   const [copied, setCopied] = useState(false);
   const [selectedLang, setSelectedLang] = useState(language);

   const currentCode = languages ? languages.find((l) => l.value === selectedLang)?.code || code : code;
   const currentLang = languages ? selectedLang : language;

   const handleCopy = async () => {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div className="group relative my-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
         <div className="flex items-center justify-between bg-slate-50 px-6 py-3.5 border-b border-slate-200">
            <div className="flex gap-2">
               {languages ? (
                  languages.map((lang: Languages) => (
                     <button
                        key={lang.value}
                        onClick={() => setSelectedLang(lang.value)}
                        className={cn(
                           "px-3 py-1.5 text-sm font-medium transition-all rounded-md",
                           selectedLang === lang.value
                              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        )}
                     >
                        {lang.label}
                     </button>
                  ))
               ) : (
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{language}</span>
               )}
            </div>
            <Button
               size="sm"
               variant="ghost"
               onClick={handleCopy}
               className="h-8 text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
            >
               {copied ? (
                  <>
                     <Check className="h-4 w-4 mr-1.5 text-green-600" />
                     <span className="text-green-600 font-medium">Copied</span>
                  </>
               ) : (
                  <>
                     <Copy className="h-4 w-4 mr-1.5" />
                     <span className="font-medium">Copy</span>
                  </>
               )}
            </Button>
         </div>
         <div className="overflow-x-auto bg-[#282c34]">
            <pre className="m-6 text-[15px] leading-relaxed">
               <code className="font-mono">
                  <HighlightedCode code={currentCode} language={currentLang} />
               </code>
            </pre>
         </div>
      </div>
   );
}
