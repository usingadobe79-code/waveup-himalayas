import { MotionProvider } from "@/components/providers/MotionProvider";

/**
 * /about is the only route whose sections (OurTeam, WhyChooseUs) still use
 * framer-motion, so the LazyMotion provider lives here rather than in the root
 * layout. That keeps the ~60KB motion feature bundle off every other route —
 * notably the home page, where it was sitting on the LCP critical path.
 */
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
