"use client";
import { media } from "@/lib/media";
import MediaImage from "@/components/MediaImage";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { MesudarWordmark, renderTextWithMesudar } from "@/components/MesudarWordmark";
import { FEEDER_MAT_BUNDLE } from "@/lib/bundles/feeder-mat-bundle";
import { formatILS } from "@/lib/pricing";

const FEEDER_MEDIUM_PRICE = 219;
const BUNDLE_ADDON_MEDIUM = FEEDER_MAT_BUNDLE.addonPriceBySize.medium;
const BUNDLE_FROM_PRICE = FEEDER_MEDIUM_PRICE + BUNDLE_ADDON_MEDIUM;
const BUNDLE_IMAGE = media("bundle.png");

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.7;

const containerV = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const imgV = {
  hidden: { opacity: 0, scale: 0.94, y: 28 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATION + 0.1, ease: EASE },
  },
};

const headV = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
};

const cardV = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

interface Feature {
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    title: "עמדת ההאכלה MESUDAR",
    desc: "גובה מדויק לחיית המחמד, קערות נירוסטה נשלפות ומערכת ניקוז שמונעת בלגן סביב האוכל",
  },
  {
    title: "משטח ההאכלה MESUDAR",
    desc: "מותאם בדיוק לעמדת ההאכלה MESUDAR — שוליים מוגבהים שמכילים מזון ומים שנשפכים והתזות לפני שהן מגיעות לרצפה",
  },
  {
    title: "משלוח חינם · אחריות שנתיים",
    desc: "כל החבילה מגיעה באריזה מוגנת, משלוח חינם לכל הארץ ואחריות יצרן לשנתיים",
  },
];

function BundleMobile() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8">
      <div className="flex w-full flex-col gap-3 text-center">
        <motion.h2 id="bundle-heading" variants={headV} className="section-h2 section-h2-on-dark text-[clamp(1.5rem,5.8vw,2.1rem)] leading-[1.1]">
          <strong className="font-bold">עמדת ההאכלה ומשטח ההאכלה</strong>{" "}
          של <MesudarWordmark />
        </motion.h2>
        <motion.p variants={headV} className="section-lead section-lead-on-dark text-[14px] leading-[1.6]">
          תוכננו יחד עבור פינת האכלה מסודרת ונקייה.
        </motion.p>
      </div>

      <motion.div variants={imgV} className="relative flex w-full flex-col items-center">
        <div className="relative aspect-[4/3] w-full max-h-[min(calc(var(--screen-h)*0.7),32rem)] sm:max-h-[min(calc(var(--screen-h)*0.75),36rem)]">
          <MediaImage
            src={BUNDLE_IMAGE}
            alt="עמדת ההאכלה ומשטח ההאכלה MESUDAR"
            fill
            className="object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.4)]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            draggable={false}
          />
        </div>
      </motion.div>

      <motion.ul variants={containerV} className="w-full flex flex-col gap-2">
        {features.map((f) => (
          <motion.li
            key={f.title}
            variants={cardV}
            className="group border border-cream/10 bg-cream/[0.06] px-3.5 py-3.5 transition-all duration-300 hover:border-clay/40"
          >
            <p className="font-display text-[15px] font-semibold leading-snug text-cream">
              {renderTextWithMesudar(f.title)}
            </p>
            <p className="mt-1.5 text-[14px] leading-[1.65] text-cream/70">
              {renderTextWithMesudar(f.desc)}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function BundleDesktop() {
  return (
    <div
      dir="ltr"
      className="mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(0,64%)_minmax(0,36%)] lg:items-center lg:gap-x-8 xl:gap-x-10"
    >
      <motion.div variants={imgV} className="flex items-center justify-center self-center">
        <div className="relative aspect-[4/3] w-full max-h-[min(82vh,44rem)] xl:max-h-[min(88vh,50rem)]">
          <MediaImage
            src={BUNDLE_IMAGE}
            alt="עמדת ההאכלה ומשטח ההאכלה MESUDAR"
            fill
            className="object-contain drop-shadow-[0_28px_56px_rgba(31,58,82,0.22)]"
            sizes="50vw"
            draggable={false}
          />
        </div>
      </motion.div>

      <div dir="rtl" className="relative z-10 flex min-w-0 flex-col gap-6 self-center text-start xl:gap-7">
        <motion.h2 variants={headV} className="section-h2 section-h2-on-dark text-[3.25rem] leading-[1.08] xl:text-[3.65rem]">
          <strong className="font-bold">עמדת ההאכלה ומשטח ההאכלה</strong>{" "}
          של <MesudarWordmark />
        </motion.h2>
        <motion.p variants={headV} className="section-lead section-lead-on-dark max-w-lg text-[19px] leading-[1.75] xl:text-[21px]">
          {renderTextWithMesudar(
            "עמדת ההאכלה MESUDAR ומשטח ההאכלה MESUDAR תוכננו יחד — הגודל תואם, החומרים משלימים זה את זה, והרצפה נשארת נקייה ויבשה גם אחרי ארוחה.",
          )}
        </motion.p>
        <motion.ul variants={containerV} className="flex w-full flex-col gap-4">
          {features.map((f) => (
            <motion.li
              key={f.title}
              variants={cardV}
              className="group border border-cream/10 bg-cream/[0.06] px-6 py-5 transition-all duration-300 hover:border-clay/40 hover:shadow-[0_8px_24px_-10px_rgba(255,159,10,0.25)]"
            >
              <p className="font-display text-[19px] font-semibold leading-snug text-cream xl:text-[21px]">
                {renderTextWithMesudar(f.title)}
              </p>
              <p className="mt-1.5 text-[16px] leading-[1.7] text-cream/70 xl:text-[17px]">
                {renderTextWithMesudar(f.desc)}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

export default function BundleSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={ref}
      id="benefits-section"
      dir="rtl"
      aria-labelledby="bundle-heading"
      className="relative isolate overflow-x-clip bg-ink text-cream max-lg:pt-6 max-lg:pb-10 lg:min-h-[calc(100svh-var(--site-header-h))] lg:flex lg:items-center lg:pt-10 lg:pb-16"
    >
      <motion.div
        variants={containerV}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="w-full px-4 sm:px-8 lg:px-[5vw]"
      >
        <ResponsiveLayout mobile={<BundleMobile />} desktop={<BundleDesktop />} />
      </motion.div>
    </section>
  );
}
