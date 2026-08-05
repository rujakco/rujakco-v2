/*
 * RUJAK.Co — Content Layer: FAQ
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "Mengapa sambal dikemas terpisah?",
    answer: "Agar buah tetap segar dan renyah saat diterima — tidak lembek, tidak tumpah.",
  },
  {
    id: "faq-2",
    question: "Mengapa pesanan dikirim keesokan harinya?",
    answer: "Kami menerapkan standar Fresh-Prep: buah dipotong 15 menit sebelum pengantaran esok hari, demi kerenyahan maksimal.",
  },
  {
    id: "faq-3",
    question: "Berapa biaya pengantarannya?",
    answer: "Biaya pengantaran dihitung berdasarkan jarak, mulai dari Rp8.000. Pilih kurir Lalamove untuk pengantaran internal, atau Paxel untuk jangkauan lebih luas.",
  },
  {
    id: "faq-4",
    question: "Bagaimana jika rujak tiba dalam kondisi tidak sempurna?",
    answer: "Kami akan menggantinya. Namun dengan Fresh-Lock System™, kemungkinan itu terjadi sangat kecil.",
  },
  {
    id: "faq-5",
    question: "Berapa lama rujak bisa disimpan?",
    answer: "Buah segar kami sebaiknya langsung dinikmati pada hari pengantaran. Sambal Mete Premium dapat bertahan hingga 3 hari di dalam lemari es.",
  },
];
