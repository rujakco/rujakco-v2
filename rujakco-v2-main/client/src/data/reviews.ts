/*
 * RUJAK.Co — Content Layer: Reviews
 * Single source of truth for customer testimonials.
 */

export interface Review {
  id: string;
  text: string;
  author: string;
  location: string;
  rating: number;
}

export const reviews: Review[] = [
  {
    id: "rev-1",
    text: "Buset ini rujak bukan kaleng-kaleng. Sambel metenya berasa banget, nggak pelit sama sekali.",
    author: "Dina",
    location: "Bekasi",
    rating: 5,
  },
  {
    id: "rev-2",
    text: "Ngidam rujak pas hamil, ini satu-satunya yang nggak ngecewain. Asem pedesnya pas banget.",
    author: "Rina",
    location: "Jakarta Timur",
    rating: 5,
  },
  {
    id: "rev-3",
    text: "Gue kira overhype, ternyata emang enak. Buahnya masih seger, nggak kayak yang udah dipotong lama.",
    author: "Aldo",
    location: "Depok",
    rating: 5,
  },
];
