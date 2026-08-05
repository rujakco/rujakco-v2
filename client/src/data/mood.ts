/*
 * RUJAK.Co — Content Layer: Mood Greetings
 * Dynamic greeting based on time of day.
 */

export interface MoodGreeting {
  className: string;
  greeting: string;
  message: string;
}

const morning: MoodGreeting = {
  className: "mood-morning",
  greeting: "Selamat pagi",
  message: "Awali hari dengan kesegaran buah tropis.",
};

const afternoon: MoodGreeting = {
  className: "mood-afternoon",
  greeting: "Selamat siang",
  message: "Waktunya camilan segar untuk semangat.",
};

const evening: MoodGreeting = {
  className: "mood-evening",
  greeting: "Selamat sore",
  message: "Selesaikan hari dengan rasa yang memuaskan.",
};

const night: MoodGreeting = {
  className: "mood-night",
  greeting: "Selamat malam",
  message: "Ngidam rujak malam-malam? Kami siap untuk besok.",
};

export function getMoodGreeting(): MoodGreeting {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return morning;
  if (hour >= 11 && hour < 15) return afternoon;
  if (hour >= 15 && hour < 18) return evening;
  return night;
}

export function getGreetingForUser(name: string): string {
  const mood = getMoodGreeting();
  return `${mood.greeting}, ${name}`;
}
