import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import CodeBlockEnhancer from '@/components/CodeBlockEnhancer'
import PageTransition from '@/components/PageTransition'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgressBar />
      <CodeBlockEnhancer />
      <Header />
      <main className="flex-grow">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}