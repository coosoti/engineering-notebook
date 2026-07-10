export function generateProjectSchema(project: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.title,
    "description": project.summary,
    "url": `https://yourdomain.com/projects/${project.slug}`,
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": tutorial.title,
    "description": tutorial.summary,
    "url": `https://yourdomain.com/tutorials/${tutorial.slug}`,
    "image": tutorial.og_image || "",
    "author": {
      "@type": "Person",
      "name": tutorial.author?.name || "Author",
    },
    "datePublished": tutorial.published_at,
    "dateModified": tutorial.updated_at,
  }
}
