import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { OrganicButton } from "../components/OrganicButton";
import { OrganicInput } from "../components/OrganicInput";
import TiltedCard from "../components/TiltedCard";
import Lenis from "lenis";
import ScrollFloat from "../components/ScrollFloat";
import { useTitle } from "../hooks/useTitle";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Home() {
  useTitle("Баланист");
  const [inputValue, setInputValue] = useState("");
  const [stage, setStage] = useState<"idle" | "loading" | "result">("idle");
  const lenisRef = useRef<Lenis | null>(null);
  const isMobile = useIsMobile(768);

  useEffect(() => {
    if (isMobile) return;
    const lenis = new Lenis({
      duration: 1,
      easing: (t) => t * (2 - t),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy?.();
  }, [isMobile]);

  const smoothScrollTo = (target: string, offset = 0) => {
    const el = document.getElementById(target);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY + offset;

    if (isMobile) {
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      lenisRef.current?.scrollTo(y, { duration: 1.2 });
    }
  };

  const handleGenerate = () => {
    if (stage === "loading") return;
    setStage("loading");

    // сначала скроллим к блоку "генерация
    setTimeout(() => smoothScrollTo("section-2", 0), 1000);

    setTimeout(() => {
      setStage("result");
      setTimeout(() => smoothScrollTo("section-3", 0), 1000);
    }, 2500);
  };

  return (
    <main
      className="relative flex flex-col items-center py-20 overflow-hidden max-w-dvw min-h-screen"
      id="main-block"
    >
      {/* главный блок */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="
          mt-10 
          p-10 sm:p-16
          relative 
          z-20 
          flex flex-col 
          items-center 
          gap-6 
          w-full 
          max-w-xl 
          transition-all 
          duration-300 
          shadow-2xl 
          shadow-emerald-700/30 
          -rotate-1 
          bg-base-200/80
        "
        style={{
          borderRadius: "60% 40% 40% 60% / 60% 30% 70% 40%",
        }}
      >
        <div className="flex w-full flex-col items-center gap-4 text-center text-base-content/80">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold"
          >
            Сбалансируйте свой рацион
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-normal leading-normal max-w-xl"
          >
            Создайте свою персональную тарелку здорового питания на основе ваших
            предпочтений.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col items-center gap-4"
        >
          <OrganicInput
            label="Укажите ваши предпочтения или калории"
            placeholder="Например: 1800 ккал, больше белка"
            value={inputValue}
            onChange={setInputValue}
          />
          <OrganicButton onClick={handleGenerate}>
            Сгенерировать тарелку
          </OrganicButton>
        </motion.div>
      </motion.div>

      {/* секции ниже */}
      <section className="mt-35 sm:mt-60 w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {stage === "loading" && (
            <motion.div
              key="loader"
              id="section-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center h-150 text-2xl"
            >
              <ScrollFloat
                animationDuration={1}
                ease="back.inOut(2)"
                scrollStart="center bottom+=50%"
                scrollEnd="bottom bottom-=40%"
                stagger={0.06}
                textClassName="animate-pulse text-3xl font-bold"
              >
                Генерация...
              </ScrollFloat>
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div
              key="result"
              id="section-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="p-4 rounded-2xl flex flex-col gap-4 justify-center items-center shadow-2xl bg-base-100"
            >
              {isMobile ? (
                <div className="m-4 rounded-2xl overflow-hidden">
                  <img
                    alt="Food"
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80"
                  ></img>
                </div>
              ) : (
                <TiltedCard
                  altText="Food"
                  rotateAmplitude={12}
                  scaleOnHover={1.1}
                  showMobileWarning={true}
                  imageSrc="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80"
                  displayOverlayContent={true}
                  showTooltip={false}
                />
              )}

              <div className="space-y-4 mt-4 text-center">
                <h2 className="text-2xl text-emerald-600">
                  Выводы и рекомендации
                </h2>
                <p className="text-lg">40% высокоуглеводных продуктов</p>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-base-200 rounded-2xl p-4 space-y-4 text-base-content/80">
                  <h3 className="text-2xl text-center ">Советы</h3>
                  <p className="text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quos, quo magnam! Enim facilis incidunt in explicabo omnis
                    tempore dicta iste natus porro ex soluta iusto, quos
                    repellendus consequatur sequi totam.
                  </p>
                </div>
                <div className="bg-base-200 rounded-2xl p-4 space-y-4 text-base-content/80">
                  <h3 className="text-2xl text-center ">Ингридиенты</h3>
                  <p className="text-center">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quos, quo magnam! Enim facilis incidunt in explicabo omnis
                    tempore dicta iste natus porro ex soluta iusto, quos
                    repellendus consequatur sequi totam.
                  </p>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => smoothScrollTo("header")}
              >
                Вернутся на вверх
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
