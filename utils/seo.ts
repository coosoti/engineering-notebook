interface SEOConfig {
  title: string
  description: string
  url: string
  image?: string
}

export function generateSEOConfig(config: SEOConfig) {
  const siteTitle = "Engineering Notebook"
  const fullTitle = `${config.title} | ${siteTitle}`

  return {
    title: fullTitle,
    description: config.description,
    openGraph: {
      title: fullTitle,
      description: config.description,
      url: config.url,
      siteName: siteTitle,
      images: config.image ? [
        {
          url: config.image,
          width: 1200,
          height: 630,
          alt: config.title,
        }
      ] : undefined,
      locale: 'en-US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: config.description,
      images: config.image ? [config.image] : undefined,
    },
  }
}