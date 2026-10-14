"use client";

import { useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { landingContent } from "@/config/landing";
import styles from "./styles/quiz-landing.module.css";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function QuizLanding() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { hotelStatus, location } = landingContent;

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 18,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: easeOut },
    },
  };

  const chipItem: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 10,
      scale: reduceMotion ? 1 : 0.97,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 0.4, ease: easeOut },
    },
  };

  return (
    <main className={styles.page}>
      <div className={styles.hero} aria-hidden>
        <motion.div
          className={styles.heroImageWrap}
          initial={reduceMotion ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: easeOut }}
        >
          <Image
            src="/img/hero-main.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        </motion.div>
        <div className={styles.overlay} />
      </div>

      <motion.div
        className={styles.shell}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className={styles.content}>
          <motion.p className={styles.eyebrow} variants={item}>
            {landingContent.eyebrow}
          </motion.p>

          <motion.h1 className={styles.brand} variants={item}>
            {landingContent.brand.split(" ").map((word, index) => (
              <span key={word}>
                {index > 0 ? " " : null}
                <span className={index === 0 ? undefined : styles.brandAccent}>
                  {word}
                </span>
              </span>
            ))}
          </motion.h1>

          <motion.p className={styles.subtitle} variants={item}>
            Камерный дом премиум-класса
            {"\n"}в тихом дворе{" "}
            <span className={styles.subtitleAccent}>Садового кольца</span>
          </motion.p>

          <motion.p className={styles.locationLine} variants={item}>
            <span>{location.district}</span>
            <span className={styles.dot} aria-hidden />
            <span>{location.metro}</span>
            <span className={styles.dot} aria-hidden />
            <span>{location.address}</span>
          </motion.p>

          <motion.ul className={styles.heroChips} variants={item}>
            {landingContent.heroChips.map((chip) => (
              <li key={chip} className={styles.chip}>
                {chip}
              </li>
            ))}
          </motion.ul>

          <motion.div className={styles.facts} variants={item}>
            {landingContent.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <span className={styles.factValue}>{fact.value}</span>
                <span className={styles.factLabel}>{fact.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className={styles.hotelBlock} variants={item}>
            <h2 className={styles.hotelTitle}>
              {hotelStatus.title}
              <span className={styles.hotelAccent}>
                {" "}
                — {hotelStatus.titleAccent}
              </span>
            </h2>

            <motion.ul
              className={styles.hotelChips}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {hotelStatus.chips.map((chip) => (
                <motion.li
                  key={chip}
                  className={styles.chip}
                  variants={chipItem}
                >
                  {chip}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className={styles.ctaBar}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.65,
          delay: reduceMotion ? 0 : 0.45,
          ease: easeOut,
        }}
      >
        <p className={styles.ctaHint}>5 коротких вопросов · около минуты</p>
        <motion.button
          type="button"
          className={styles.ctaButton}
          onClick={() => setOpen(true)}
          whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <span className={styles.ctaLabel}>{landingContent.cta}</span>
          <span className={styles.ctaArrow} aria-hidden>
            →
          </span>
        </motion.button>
      </motion.div>

      <QuizModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
