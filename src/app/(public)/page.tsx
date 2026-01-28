import { Suspense } from "react"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { CollectionPreview } from "@/components/landing/CollectionPreview"
import { Testimonials } from "@/components/landing/Testimonials"

// Loading skeleton for collection preview
function CollectionSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 w-80 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Suspense fallback={<CollectionSkeleton />}>
        <CollectionPreview />
      </Suspense>
      <Testimonials />
    </>
  )
}
