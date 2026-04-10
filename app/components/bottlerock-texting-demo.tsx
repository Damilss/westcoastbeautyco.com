"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type BottleRockConversationOption = {
  id: string;
  userLabel: string;
  userMessage: string;
  botResponse: string;
  responseDelayMs?: number;
};

type ThreadMessage = {
  id: string;
  sender: "guest" | "studio";
  text: string;
};

type BottleRockTextingDemoProps = {
  bookingUrl: string;
  contactUrl?: string;
  conversationOptions?: readonly BottleRockConversationOption[];
};

const TYPING_START_DELAY_MS = 220;
const DEFAULT_RESPONSE_DELAY_MS = 1280;

const DEFAULT_CONVERSATION_OPTIONS: readonly BottleRockConversationOption[] = [
  {
    id: "walk-ups",
    userLabel: "Do you take walk-ups?",
    userMessage: "Hi! Do you take walk-ups at BottleRock?",
    botResponse:
      "Yes, we do when space opens up. We always recommend booking ahead for your preferred time.",
  },
  {
    id: "timing",
    userLabel: "How long does it take?",
    userMessage: "How long is a typical piercing appointment?",
    botResponse:
      "Most appointments are about 10-20 minutes, depending on your service and jewelry selection.",
    responseDelayMs: 1400,
  },
  {
    id: "jewelry",
    userLabel: "What jewelry options?",
    userMessage: "What jewelry do you have available this weekend?",
    botResponse:
      "We offer curated titanium and solid gold options that are festival-ready and selected to match your look.",
  },
  {
    id: "group-booking",
    userLabel: "Can we book together?",
    userMessage: "Can I reserve spots for me and my friends together?",
    botResponse:
      "Absolutely. Book back-to-back times and we can style your group in one coordinated session.",
  },
  {
    id: "location",
    userLabel: "Where can I find you?",
    userMessage: "Where is West Coast Beauty located at BottleRock?",
    botResponse:
      "You can find us inside the Beauty Bar experience. Once you book, we send exact location details and check-in notes.",
    responseDelayMs: 1520,
  },
] as const;

const INITIAL_THREAD: readonly ThreadMessage[] = [
  {
    id: "welcome",
    sender: "studio",
    text: "Hi love. I am the West Coast Beauty concierge. Tap a question below and I can help you plan your BottleRock appointment.",
  },
];

export function BottleRockTextingDemo({
  bookingUrl,
  contactUrl = "/contact",
  conversationOptions = DEFAULT_CONVERSATION_OPTIONS,
}: BottleRockTextingDemoProps) {
  const [thread, setThread] = useState<ThreadMessage[]>([...INITIAL_THREAD]);
  const [usedOptionIds, setUsedOptionIds] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  const usedOptionSetRef = useRef(new Set<string>());
  const respondingRef = useRef(false);
  const threadRef = useRef<HTMLDivElement | null>(null);
  // Keep timeout IDs in refs so repeated taps cannot leave stale timers behind.
  const typingTimeoutRef = useRef<number | null>(null);
  const responseTimeoutRef = useRef<number | null>(null);

  const clearPendingTimers = useCallback(() => {
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (responseTimeoutRef.current !== null) {
      window.clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearPendingTimers();
      respondingRef.current = false;
    };
  }, [clearPendingTimers]);

  useEffect(() => {
    const scroller = threadRef.current;
    if (!scroller) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      scroller.scrollTo({
        top: scroller.scrollHeight,
        behavior: thread.length > 1 ? "smooth" : "auto",
      });
    }, 24);

    return () => window.clearTimeout(scrollTimer);
  }, [thread, isTyping]);

  const remainingOptions = useMemo(
    () => conversationOptions.filter((option) => !usedOptionIds.includes(option.id)),
    [conversationOptions, usedOptionIds]
  );

  const handleOptionSelect = useCallback(
    (option: BottleRockConversationOption) => {
      if (respondingRef.current || usedOptionSetRef.current.has(option.id)) {
        return;
      }

      respondingRef.current = true;
      usedOptionSetRef.current.add(option.id);

      setIsResponding(true);
      setIsTyping(false);
      setUsedOptionIds(Array.from(usedOptionSetRef.current));
      setThread((currentThread) => [
        ...currentThread,
        {
          id: `guest-${option.id}`,
          sender: "guest",
          text: option.userMessage,
        },
      ]);

      clearPendingTimers();

      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(true);
      }, TYPING_START_DELAY_MS);

      const responseDelayMs = Math.max(
        option.responseDelayMs ?? DEFAULT_RESPONSE_DELAY_MS,
        TYPING_START_DELAY_MS + 380
      );

      responseTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
        setThread((currentThread) => [
          ...currentThread,
          {
            id: `studio-${option.id}`,
            sender: "studio",
            text: option.botResponse,
          },
        ]);
        setIsResponding(false);
        respondingRef.current = false;
      }, responseDelayMs);
    },
    [clearPendingTimers]
  );

  return (
    <div className="w-full max-w-[45rem]">
      <motion.div
        className="rounded-[4.2rem] border border-[#1f2023] bg-[linear-gradient(145deg,#f9fafc_0%,#edf1f6_100%)] p-[1.1rem] shadow-[0_52px_110px_-58px_rgba(7,16,28,0.78)]"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative overflow-hidden rounded-[3.2rem] border border-[#cfd7e4] bg-[#f6f8fc] px-[1.18rem] pb-[1.2rem] pt-[2.95rem]">
          <div className="pointer-events-none absolute left-1/2 top-[0.66rem] h-[1.22rem] w-[9.2rem] -translate-x-1/2 rounded-full bg-[#050608] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_0_rgba(0,0,0,0.55)]">
            <span className="absolute left-[0.72rem] top-1/2 h-[0.18rem] w-[5.9rem] -translate-y-1/2 rounded-full bg-[#0f1218]" />
            <span className="absolute right-[0.48rem] top-1/2 h-[0.76rem] w-[0.76rem] -translate-y-1/2 rounded-full bg-[#222936] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)]" />
            <span className="absolute right-[0.7rem] top-[0.42rem] h-[0.2rem] w-[0.2rem] rounded-full bg-[#7fa5ff]/65" />
          </div>

          <div className="mb-[1rem] rounded-[1.52rem] border border-[#d7deea] bg-white/95 px-[0.92rem] py-[0.78rem] shadow-[0_16px_24px_-24px_rgba(15,23,42,0.7)]">
            <div className="flex items-center justify-between gap-[0.66rem]">
              <div className="inline-flex items-center gap-[0.42rem] rounded-full bg-[#eff4fc] px-[0.62rem] py-[0.36rem] text-[#0a84ff]">
                <svg
                  viewBox="0 0 20 20"
                  className="h-[1.2rem] w-[1.2rem]"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.5 4.5L7 10l5.5 5.5" />
                </svg>
                <span className="text-[1.08rem] font-semibold leading-none">17</span>
              </div>

              <div className="min-w-0 flex-1 text-center">
                <div className="mx-auto mb-[0.34rem] h-[3.4rem] w-[3.4rem] overflow-hidden rounded-full border border-[#d8deea] bg-white">
                  <Image
                    src="/logo.png"
                    alt="West Coast Beauty logo"
                    width={68}
                    height={68}
                    className="h-full w-full object-contain p-[0.16rem]"
                  />
                </div>
                <p className="m-0 truncate text-[1.3rem] font-semibold leading-[1.16] text-[#111827]">
                  West Coast Beauty
                </p>
              </div>

              <div className="flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-[#eff4fc] text-[#0a84ff]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[1.65rem] w-[1.65rem]"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2.8" y="6.6" width="12.8" height="10.8" rx="2.8" />
                  <path d="M15.6 10.2L21.2 6.8v10.4l-5.6-3.4" />
                </svg>
              </div>
            </div>
          </div>

          <div
            ref={threadRef}
            className="h-[34.8rem] overflow-y-auto pr-[0.24rem] [scrollbar-width:thin]"
            aria-live="polite"
          >
            <AnimatePresence initial={false}>
              {thread.map((message, index) => {
                const isGuestMessage = message.sender === "guest";
                const previousSender = index > 0 ? thread[index - 1]?.sender : null;
                const addTopSpace = previousSender && previousSender !== message.sender;

                return (
                  <motion.div
                    key={message.id}
                    layout
                    className={`flex ${isGuestMessage ? "justify-end" : "justify-start"} ${
                      addTopSpace ? "mt-[1rem]" : "mt-[0.58rem]"
                    }`}
                    initial={{ opacity: 0, y: 12, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className={`max-w-[83%] rounded-[1.8rem] px-[1.22rem] py-[0.88rem] text-[1.38rem] leading-[1.42] shadow-[0_10px_20px_-18px_rgba(15,23,42,0.95)] ${
                        isGuestMessage
                          ? "rounded-br-[0.66rem] bg-[#0a84ff] text-white"
                          : "rounded-bl-[0.66rem] bg-[#e9ebef] text-[#111827]"
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                );
              })}

              {isTyping ? (
                <motion.div
                  key="typing-indicator"
                  className="mt-[1rem] flex justify-start"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-[0.4rem] rounded-[1.8rem] rounded-bl-[0.66rem] bg-[#e9ebef] px-[1.1rem] py-[0.78rem]">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-[0.58rem] w-[0.58rem] rounded-full bg-[#6b7280]"
                        animate={{ opacity: [0.28, 0.85, 0.28], y: [0, -1.6, 0] }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          delay: dot * 0.16,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="mt-[1.28rem] border-t border-[#d4dbe6] pt-[1.08rem]">
            <div className="rounded-[1.62rem] border border-[#d7deea] bg-[#f4f7fc] p-[0.5rem]">
              <div className="flex items-center gap-[0.54rem]">
                <div className="flex h-[2.76rem] w-[2.76rem] items-center justify-center rounded-full bg-white text-[#0a84ff] shadow-[0_6px_12px_-10px_rgba(15,23,42,0.8)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[1.42rem] w-[1.42rem]"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>

                <div className="min-w-0 flex-1 rounded-full border border-[#d8deea] bg-white px-[1.06rem] py-[0.64rem] text-[1.18rem] leading-none text-[#6b7280]">
                  Messages
                </div>

                <div className="flex h-[2.76rem] w-[2.76rem] items-center justify-center rounded-full bg-white text-[#0a84ff] shadow-[0_6px_12px_-10px_rgba(15,23,42,0.8)]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[1.48rem] w-[1.48rem]"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 8.6v6.8M10 7v10M13 8.2v7.6M16 9.6v4.8M5 15.8h14" />
                  </svg>
                </div>
              </div>
            </div>

            <p className="mt-[0.92rem] mb-0 text-[1.05rem] uppercase tracking-[0.15em] text-[#64748b]">
              Suggested Replies
            </p>
            <div className="mt-[0.8rem] flex flex-wrap gap-[0.62rem]">
              {remainingOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  disabled={isResponding}
                  className="rounded-full border border-[#d3dbe8] bg-white px-[1.12rem] py-[0.62rem] text-left text-[1.2rem] leading-[1.25] text-[#1f2937] transition disabled:cursor-not-allowed disabled:opacity-55 hover:bg-[#f2f6ff]"
                >
                  {option.userLabel}
                </button>
              ))}
            </div>
            {remainingOptions.length === 0 ? (
              <p className="mt-[0.84rem] mb-0 text-[1.22rem] leading-[1.45] text-[#475569]">
                You are all set. Reserve now and we will handle the rest.
              </p>
            ) : null}
          </div>
        </div>
      </motion.div>

      <div className="mt-[1.3rem] flex flex-col gap-[0.72rem] sm:flex-row">
        <a
          href={bookingUrl}
          className="inline-flex items-center justify-center rounded-full border border-[#0a84ff] bg-[#0a84ff] px-[1.42rem] py-[1.1rem] text-[1.36rem] font-semibold tracking-[0.01em] text-white transition hover:-translate-y-[1px] hover:bg-[#0074e4]"
        >
          Book now
        </a>
        <a
          href={contactUrl}
          className="inline-flex items-center justify-center rounded-full border border-[#bfd1f5] bg-[#f5f9ff] px-[1.42rem] py-[1.1rem] text-[1.36rem] font-semibold tracking-[0.01em] text-[#0a84ff] transition hover:-translate-y-[1px] hover:bg-[#ebf3ff]"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}
