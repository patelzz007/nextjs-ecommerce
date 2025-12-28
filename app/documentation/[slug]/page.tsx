import { notFound } from "next/navigation"
import { getDocBySlug, getAllDocs, getPreviousDoc, getNextDoc } from "@/lib/mdx-utils"
import { DocSidebar } from "@/components/documentation/doc-sidebar"
import { TableOfContents } from "@/components/documentation/table-of-contents"
import { CodeBlock } from "@/components/documentation/code-block"
import ReactMarkdown from "react-markdown"
import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    return {
      title: "Not Found",
    }
  }

  return {
    title: `${doc.metadata.title} | API Documentation`,
    description: doc.metadata.description,
  }
}

const components = {
  pre: ({ children, ...props }: any) => {
    const codeElement = children?.props || children
    const code = codeElement?.children || ""
    const language = codeElement?.className?.replace("language-", "") || "text"

    return <CodeBlock code={code} language={language} />
  },
  code: ({ node, inline, className, children, ...props }: any) => {
    if (inline) {
      return (
        <code className="px-2 py-1 bg-slate-100 text-indigo-700 rounded-md text-sm font-mono font-medium" {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  h2: ({ children, ...props }: any) => (
    <h2
      id={String(children).toLowerCase().replace(/\s+/g, "-")}
      className="mt-12 mb-4 text-3xl font-bold text-slate-900 tracking-tight"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3
      id={String(children).toLowerCase().replace(/\s+/g, "-")}
      className="mt-8 mb-3 text-xl font-semibold text-slate-900"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-4 text-slate-700 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  table: ({ children, ...props }: any) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-900" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border-b border-slate-100 px-4 py-3 text-slate-700" {...props}>
      {children}
    </td>
  ),
  a: ({ children, href, ...props }: any) => (
    <a
      href={href}
      className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-indigo-300 hover:decoration-indigo-500 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  const previousDoc = getPreviousDoc(slug)
  const nextDoc = getNextDoc(slug)

  return (
    <div className="flex min-h-screen">
      <DocSidebar />

      <main className="w-full xl:ml-80 xl:mr-80 px-4 sm:px-6 md:px-8 py-8 pt-20 xl:pt-8">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-slate max-w-none">
            <div className="mb-10">
              <p className="text-sm text-indigo-600 font-semibold mb-3 uppercase tracking-wider">
                {doc.metadata.category}
              </p>
              <h1 className="text-4xl font-bold mb-3 text-slate-900 tracking-tight">{doc.metadata.title}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{doc.metadata.description}</p>
            </div>

            <ReactMarkdown components={components}>{doc.content}</ReactMarkdown>

            <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              {previousDoc ? (
                <Link
                  href={`/documentation/${previousDoc.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="text-xs text-slate-500 mb-1 font-medium">Previous</div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {previousDoc.metadata.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextDoc ? (
                <Link
                  href={`/documentation/${nextDoc.slug}`}
                  className="group flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 md:col-start-2"
                >
                  <div className="flex-1 text-right">
                    <div className="text-xs text-slate-500 mb-1 font-medium">Next</div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {nextDoc.metadata.title}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                </Link>
              ) : null}
            </div>
          </article>
        </div>
      </main>

      <div className="hidden xl:block">
        <TableOfContents />
      </div>
    </div>
  )
}
