import { motion } from "framer-motion";

type Props = {
  onClose: () => void;
};

export default function LocationPermission({
  onClose,
}: Props) {

  const allowLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        localStorage.setItem(
          "rujak-location-enabled",
          "true"
        );
        onClose();
      },
      () => {
        onClose();
      }
    );
  };

  const later = () => {
    localStorage.setItem(
      "rujak-location-dismissed",
      "true"
    );

    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black/40 flex items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-t-[32px] w-full p-7"
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 22,
        }}
      >
        <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto mb-6" />

        <div className="text-5xl text-center">
          📍
        </div>

        <h2 className="text-2xl font-bold text-center mt-5">
          Aktifkan Lokasi
        </h2>

        <p className="text-center text-gray-500 mt-3 leading-relaxed">
          Temukan outlet terdekat,
          hitung ongkir lebih akurat,
          dan dapatkan promo khusus di kotamu.
        </p>

        <button
          onClick={allowLocation}
          className="mt-8 w-full h-14 rounded-2xl bg-[#082E21] text-white font-semibold"
        >
          Aktifkan Lokasi
        </button>

        <button
          onClick={later}
          className="mt-3 w-full h-14 rounded-2xl border border-gray-300 font-medium"
        >
          Nanti Saja
        </button>
      </motion.div>
    </motion.div>
  );
}