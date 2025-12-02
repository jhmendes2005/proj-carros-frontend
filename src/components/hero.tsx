"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Slide {
  imageSrc: string;
  alt: string;
  href?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const slides: Slide[] = [
  {
    imageSrc: "/banner2.png", // Ajuste para referência correta
    alt: "Banner principal da Bom Jesus Automóveis",
    //title: "Bom Jesus Automóveis",
    //subtitle: "Qualidade e confiança na compra do seu próximo veículo.",
    href: "/estoque",
    //buttonText: "Ver Estoque",
  },
  {
    imageSrc: "/banner.png", // Ajuste para referência correta
    alt: "Banner principal da Bom Jesus Automóveis",
    //title: "Bom Jesus Automóveis",
    //subtitle: "Qualidade e confiança na compra do seu próximo veículo.",
    href: "/estoque",
    //buttonText: "Ver Estoque",
  },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full">
      {/* Carrossel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative w-full aspect-video md:aspect-[21/9] max-h-[500px] flex-none"
            >
              <Image
                src={slide.imageSrc}
                alt={slide.alt}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
                quality={75}
              />

              {(slide.title || slide.subtitle) && (
                <div className="absolute inset-0 bg-black/40 z-10" />
              )}

              <div className="relative z-20 flex flex-col items-center justify-center text-center text-white p-4 h-full">
                {slide.title && (
                  <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
                    {slide.title}
                  </h1>
                )}

                {slide.subtitle && (
                  <p className="text-base md:text-xl max-w-2xl mb-8">
                    {slide.subtitle}
                  </p>
                )}

                {slide.href && slide.buttonText && (
                  <Link
                    href={slide.href}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    {slide.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de navegação */}
      <button
        className="absolute top-1/2 left-2 md:left-4 z-30 -translate-y-1/2 rounded-full bg-white/70 p-1 md:p-2 text-gray-800 shadow-md transition hover:bg-white"
        onClick={scrollPrev}
      >
        <ArrowLeft size={20} className="md:h-6 md:w-6" />
      </button>

      <button
        className="absolute top-1/2 right-2 md:right-4 z-30 -translate-y-1/2 rounded-full bg-white/70 p-1 md:p-2 text-gray-800 shadow-md transition hover:bg-white"
        onClick={scrollNext}
      >
        <ArrowRight size={20} className="md:h-6 md:w-6" />
      </button>
    </div>
  );
}
