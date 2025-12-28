import { DocSidebar } from "@/components/documentation/doc-sidebar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function DocumentationIndex() {
  return (
    <div className="flex min-h-screen bg-white">
      <DocSidebar />

      <main className="xl:ml-80 flex-1 px-6 md:px-12 py-8 pt-20 xl:pt-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Introduction</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              This API reference includes our Store APIs, which are REST APIs exposed by the backend. They are typically
              used to create a storefront for your commerce store, such as a webshop or a commerce mobile app.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              All endpoints are prefixed with{" "}
              <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm">/store</code>. So, during
              development, the endpoints will be available under the path{" "}
              <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm">http://localhost:9000/store</code>.
              For production, replace{" "}
              <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm">http://localhost:9000</code> with
              your backend URL.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting Started</h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              There are different ways you can send requests to these endpoints, including:
            </p>

            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
              <li>Using our JavaScript Client SDK</li>
              <li>Using React hooks from our React library</li>
              <li>Using cURL or your favorite HTTP client</li>
              <li>Using third-party tools like Postman or Insomnia</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Base URL</h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <code className="text-sm text-gray-900">https://your-store.com/store</code>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Authentication</h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Some endpoints require authentication. Learn more about authentication in the{" "}
              <Link href="/documentation/authentication" className="text-blue-600 hover:text-blue-800 font-medium">
                Authentication guide
              </Link>
              .
            </p>

            <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">Modified at 2024-12-28</div>
              <Link
                href="/documentation/authentication"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Next: Authentication
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
