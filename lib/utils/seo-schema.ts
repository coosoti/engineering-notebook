export function generateProjectSchema(project: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://engineering-notebook.vercel.app"
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.title,
    "description": project.summary,
    "url": `${baseUrl}/projects/${project.slug}`,
    "image": project.og_image || "",
    "author": {
      "@type": "Person",
      "name": project.author?.name || "Author",
    },
    "codeRepository": project.github_url || "",
    "genre": project.tags?.join(', ') || "",
  }
}

export function generateTutorialSchema(tutorial: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://engineering-notebook.vercel.app"
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": tutorial.title,
    "description": tutorial.summary,
    "url": `${baseUrl}/tutorials/${tutorial.slug}`,
    "image": tutorial.og_image || "",
    "author": {
      "@type": "Person",
      "name": tutorial.author?.name || "Author",
    },
    "datePublished": tutorial.published_at,
    "dateModified": tutorial.updated_at,
  }
}
