export interface MemoryItem {
  id: string;
  image: string;
  title: string;
  date?: string;
  location?: string;
  caption: string;
  rotation: number;
}

export interface StoryQuote {
  id: string;
  text: string;
  subtext?: string;
}

export const BIRTHDAY_CONFIG = {
  // Recipient Name (Easily configurable by the user)
  recipientName: "My Love",
  subtitle: "A story written just for you",
  
  // Chapter 1: Hero
  bowSubtitle: "Pull back the arrow to make your wish...",
  
  // Chapter 6 & 7: Cake
  cakeTitle: "A Moment in Time",
  cakeInstruction: "Close your eyes & make a wish...",
  
  // Chapter 9: Memories Gallery
  memories: [
    {
      id: "mem-1",
      image: "/images/memory-01.jpg",
      title: "Golden Horizons",
      date: "Sunset Beach Walk",
      location: "By the ocean waves",
      caption: "Every step beside you feels like coming home.",
      rotation: -3,
    },
    {
      id: "mem-2",
      image: "/images/memory-02.jpg",
      title: "Cozy Mornings",
      date: "Rainy Cafe Afternoon",
      location: "Our favorite corner table",
      caption: "The way you smile over warm coffee lights up the entire room.",
      rotation: 2.5,
    },
    {
      id: "mem-3",
      image: "/images/memory-03.jpg",
      title: "Sparkler Nights",
      date: "Midnight Celebration",
      location: "Under a canopy of stars",
      caption: "Amidst thousands of sparkling lights, my eyes only saw you.",
      rotation: -2,
    },
    {
      id: "mem-4",
      image: "/images/memory-04.jpg",
      title: "Starlit Dinner",
      date: "Tuscan Evening",
      location: "Candlelight & wine",
      caption: "Laughter that echoed into the night, forever etched in my memory.",
      rotation: 3.5,
    },
  ] as MemoryItem[],

  // Chapter 10: Romantic Quotes
  quotes: [
    {
      id: "q-1",
      text: "“I will be there with you, for my lifetime.”",
      subtext: "In every season, through every turn.",
    },
    {
      id: "q-2",
      text: "“Some memories become home.”",
      subtext: "And with you, I found mine.",
    },
    {
      id: "q-3",
      text: "“If I could choose again, I’d still choose you.”",
      subtext: "In a hundred lifetimes, in every universe.",
    },
    {
      id: "q-4",
      text: "“Here’s to every moment we’ve shared...”",
      subtext: "...and to all the beautiful ones still waiting for us.",
    },
  ] as StoryQuote[],

  // Chapter 11: Final Message
  finalMessage: {
    heading: "Happy Birthday,",
    wish: "May every year bring you a little closer to everything your heart quietly wishes for.",
    whisper: "And wherever life takes us...",
    promise: "I'll always be right here, cheering for you.",
    signature: "Happy Birthday ❤️",
    postscript: "You make the world softer, warmer, and endlessly brighter.",
  },
};
