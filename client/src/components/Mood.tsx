/*
 * RUJAK.Co — Experience Layer: Mood Banner
 * Dynamic greeting based on time of day. Content from mood.ts.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getMoodGreeting } from "@/data/mood";
import { useCart } from "@/contexts/CartContext";

const bgClass: Record<string, string> = {
  "mood-morning": "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200",
  "mood-afternoon": "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200",
  "mood-evening": "bg-gradient-to-r from-slate-50 to-blue-50 border-blue-200",
  "mood-night": "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200",
};

export default function Mood() {
  const { state } = useCart();
  const [greeting, setGreeting] = useState(getMoodGreeting());

  useEffect(() => {
    const id = setInterval(() => setGreeting(getMoodGreeting()), 60000);
    return () => clearInterval(id);
  }, []);

  if (!state.userName) return null;

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className={`${bgClass[greeting.className] || bgClass["mood-afternoon"]} border-b`}
    >
      <div className="container py-3 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-mango" />
        <p className="text-sm text-ink-soft">
          <span className="font-semibold">{greeting.greeting}, {state.userName}</span>
          <span className="text-ink-muted"> — {greeting.message}</span>
        </p>
      </div>
    </motion.section>
  );
}
