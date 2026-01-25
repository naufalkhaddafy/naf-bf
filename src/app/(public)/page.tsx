import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { CollectionPreview } from "@/components/landing/CollectionPreview"
import { Testimonials } from "@/components/landing/Testimonials"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <CollectionPreview />
      <Testimonials />
    </>
  )
}
