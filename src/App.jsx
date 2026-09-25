import { MotionConfig } from 'framer-motion'

import ScrollProgressBar from './components/ui/ScrollProgressBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import MarqueeBand from './components/sections/MarqueeBand'
import StorySection from './components/sections/StorySection'
import ProcessTimeline from './components/sections/ProcessTimeline'
import CreditSimulator from './components/sections/CreditSimulator'
import FAQSection from './components/sections/FAQSection'
import CTASection from './components/sections/CTASection'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative bg-noir-900 font-body text-smoke-100 overflow-x-clip">
        <ScrollProgressBar />
        <Navbar />

        <main>
          <Hero />
          <MarqueeBand />
          <StorySection />
          <ProcessTimeline />
          <CreditSimulator />
          <FAQSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  )
}
