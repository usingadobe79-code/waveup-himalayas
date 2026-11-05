import Image from "next/image";
import { displaySrc } from "@/lib/img";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Gallery — masonry of real imagery we own (docs/01 §9). v1 reuses the package /
 * hero photos as placeholders with honest captions; drop a dedicated gallery set
 * in here later (paths + captions stay data-driven). CSS-columns masonry: 2 cols
 * on mobile, 3 from md up. Tiles reveal scale-from-0.96 + fade, staggered; hover
 * zooms the photo and deepens a navy caption gradient. Reduced motion → instant,
 * no zoom.
 */
type Shot = { src: string; caption: string; ratio: string };

// Varied aspect ratios give the masonry its rhythm. Captions describe the real
// subject of each provided photo — nothing invented.
const SHOTS: Shot[] = [
  {
    src: "/images/packages/annapurna-base-camp.jpg",
    caption: "Annapurna Base Camp",
    ratio: "3 / 4",
  },
  {
    src: "/images/packages/everest-heli-tour.jpg",
    caption: "Everest by helicopter",
    ratio: "4 / 5",
  },
  {
    src: "/images/packages/poon-hill.jpg",
    caption: "Poon Hill sunrise",
    ratio: "4 / 3",
  },
  {
    src: "/images/packages/manaslu-circuit.jpg",
    caption: "Manaslu Circuit",
    ratio: "3 / 4",
  },
  {
    src: "/images/packages/chitwan-safari.jpg",
    caption: "Chitwan jungle safari",
    ratio: "4 / 3",
  },
  {
    src: "/images/packages/everest-base-camp.jpg",
    caption: "Everest Base Camp trail",
    ratio: "4 / 5",
  },
  {
    src: "/images/hero.jpg",
    caption: "Himalayan peak at sunset",
    ratio: "3 / 4",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="section-y bg-surface-dark text-on-dark">
      <div className="container-page">
        <SectionHeading
          onDark
          eyebrow="The View From Here"
          title="Moments on the Trail"
          intro="A glimpse of where our trips lead — the peaks, the light, and the wildlife along the way."
        />

        <div className="mt-12 gap-4 [column-fill:_balance] columns-2 md:mt-16 md:columns-3">
          {SHOTS.map((shot, i) => (
            <Reveal
              key={shot.src}
              className="reveal-scale mb-4 break-inside-avoid"
              delay={i * 80}
            >
              <figure className="group relative overflow-hidden rounded-card">
                <div
                  className="relative w-full"
                  style={{ aspectRatio: shot.ratio }}
                >
                  <Image
                    src={displaySrc(shot.src)}
                    alt={shot.caption}
                    fill
                    quality={82}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                  />
                  {/* Navy caption gradient — always faintly present, deepens on hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-darker/80 via-surface-darker/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <figcaption className="absolute bottom-4 left-4 right-4 type-small font-medium text-on-dark drop-shadow-[0_1px_4px_rgba(17,28,51,0.8)]">
                  {shot.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
