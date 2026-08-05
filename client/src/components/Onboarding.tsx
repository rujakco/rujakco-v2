import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Props = {
  onFinish: () => void;
};

export default function Onboarding({ onFinish }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const next = () => setStep((s) => s + 1);

  return (
    <motion.div
      className="fixed inset-0 z-[9997] bg-[#082E21] flex items-center justify-center px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence mode="wait">

        {/* STEP 1 */}
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="text-center max-w-md"
          >
            <img
              src="/assets/brand/logo.webp"
              className="w-24 mx-auto mb-8"
            />

            <h1 className="text-4xl text-white font-bold">
              Selamat Datang
            </h1>

            <p className="text-white/70 mt-4 leading-relaxed">
              Kami ingin mengenalmu agar pengalaman menikmati
              Rujak.co terasa lebih personal.
            </p>

            <button
              onClick={next}
              className="mt-10 bg-[#C5A059] hover:opacity-90 text-black px-8 py-3 rounded-full font-semibold"
            >
              Mulai
            </button>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            className="w-full max-w-md"
          >
            <h2 className="text-white text-3xl font-bold">
              Siapa nama kamu?
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
              className="mt-8 w-full rounded-2xl bg-white p-4 text-lg outline-none"
            />

            <button
              disabled={!name}
              onClick={next}
              className="mt-8 w-full rounded-2xl bg-[#C5A059] py-4 font-semibold disabled:opacity-40"
            >
              Lanjut
            </button>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <motion.div
            key="city"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            className="w-full max-w-md"
          >
            <h2 className="text-white text-3xl font-bold">
              Halo, {name} 👋
            </h2>

            <p className="text-white/70 mt-3">
              Kota mana yang akan kami layani?
            </p>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-8 w-full rounded-2xl p-4"
            >
              <option value="">Pilih Kota</option>
              <option>Jakarta</option>
              <option>Bekasi</option>
              <option>Depok</option>
              <option>Tangerang</option>
              <option>Bandung</option>
            </select>

            <button
              disabled={!city}
              onClick={() => {
                localStorage.setItem("rujak-name", name);
                localStorage.setItem("rujak-city", city);
                onFinish();
              }}
              className="mt-8 w-full rounded-2xl bg-[#C5A059] py-4 font-semibold disabled:opacity-40"
            >
              Masuk ke Rujak.co
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}