import fs from "fs"
import path from "path"
import matter from "gray-matter"

export interface DocMetadata {
  title: string
  description: string
  order?: number
  icon?: string
  category?: string
}

export interface DocContent {
  slug: string
  metadata: DocMetadata
  content: string
}

const docsDirectory = path.join(process.cwd(), "data/documentation")

export function getDocBySlug(slug: string): DocContent | null {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      metadata: data as DocMetadata,
      content,
    }
  } catch {
    return null
  }
}

export function getAllDocs(): DocContent[] {
  try {
    const files = fs.readdirSync(docsDirectory)
    const docs = files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => {
        const slug = file.replace(/\.mdx$/, "")
        return getDocBySlug(slug)
      })
      .filter((doc): doc is DocContent => doc !== null)
      .sort((a, b) => (a.metadata.order || 0) - (b.metadata.order || 0))

    return docs
  } catch {
    return []
  }
}

export function getPreviousDoc(currentSlug: string): DocContent | null {
  const allDocs = getAllDocs()
  const currentIndex = allDocs.findIndex((doc) => doc.slug === currentSlug)

  if (currentIndex > 0) {
    return allDocs[currentIndex - 1]
  }

  return null
}

export function getNextDoc(currentSlug: string): DocContent | null {
  const allDocs = getAllDocs()
  const currentIndex = allDocs.findIndex((doc) => doc.slug === currentSlug)

  if (currentIndex !== -1 && currentIndex < allDocs.length - 1) {
    return allDocs[currentIndex + 1]
  }

  return null
}
