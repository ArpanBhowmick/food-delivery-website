import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO_SLIDES } from "@/data/userDummyData/userHeroData";

const UserHero = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Auto-play the carousel.
  useEffect(() => {
    if (isCarouselPaused || HERO_SLIDES.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  // Scroll to the dishes section.
  const scrollToDishes = () => {
    document
      .getElementById("popular-dishes-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle the category button.
  const handleSlideCategorySelect = (category: string) => {
    setSelectedCategory(category);
    scrollToDishes();
  };

  // Handle the slide's search button.
  const handleSlideSearch = () => {
    scrollToDishes();
  };

  return (
    <section
      id="hero-carousel-section"
      className="relative overflow-hidden w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
    >
      <div className="w-full">
        <div className="relative flex min-h-[500px] w-full items-center overflow-hidden rounded-3xl border border-purple-200/80 bg-slate-950 shadow-2xl shadow-purple-900/10 md:min-h-[540px] lg:min-h-[570px]">
          {/* Carousel slides */}
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 flex h-full w-full items-center transition-all duration-700 ease-out ${
                  isActive
                    ? "z-10 scale-100 opacity-100"
                    : "pointer-events-none z-0 scale-105 opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.titleLine1}
                  className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.88]"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent sm:via-slate-950/70 sm:to-slate-950/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />

                {/* Slide content */}
                <div className="relative z-10 flex w-full max-w-2xl flex-col items-start gap-4 px-6 py-12 text-left sm:px-10 md:px-14">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-white shadow-sm backdrop-blur-md">
                    <span className="text-[16px]">{slide.tagIcon}</span>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-200 sm:text-[12px]">
                      {slide.tagText}
                    </span>
                  </div>

                  <h1 className="text-[30px] font-extrabold leading-[1.14] tracking-tight text-white sm:text-[42px] lg:text-[48px]">
                    {slide.titleLine1}
                    <br />
                    <span className={slide.titleHighlight}>
                      {slide.titleLine2}
                    </span>
                  </h1>

                  <p className="max-w-lg text-[14px] leading-relaxed text-slate-200 sm:text-[16px]">
                    {slide.description}
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      aria-pressed={selectedCategory === slide.buttonCategory}
                      onClick={() =>
                        handleSlideCategorySelect(slide.buttonCategory)
                      }
                      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r px-6 py-3.5 text-[14px] font-extrabold shadow-lg transition-all active:scale-[0.98] sm:text-[15px] ${slide.bgGradient}`}
                    >
                      <span>{slide.buttonText}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSlideSearch}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-[13px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                      <Search className="h-4 w-4 text-amber-300" />
                      <span>Search {slide.buttonCategory}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick search removed */}

          {/* Previous slide */}
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
              )
            }
            className="group absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white shadow-lg backdrop-blur-md transition-all hover:border-purple-400 hover:bg-[#6d28d9] active:scale-90 sm:left-5"
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Next slide */}
          <button
            type="button"
            aria-label="Next slide"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
            }
            className="group absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white shadow-lg backdrop-blur-md transition-all hover:border-purple-400 hover:bg-[#6d28d9] active:scale-90 sm:right-5"
          >
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Slide indicators */}
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 shadow-lg backdrop-blur-md">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlide;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className="cursor-pointer px-1 py-1 transition-all"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive
                        ? "h-2 w-8"
                        : "h-2 w-2 bg-white/40 hover:bg-white/80"
                    }`}
                    style={{
                      backgroundColor: isActive ? slide.accentColor : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserHero;
