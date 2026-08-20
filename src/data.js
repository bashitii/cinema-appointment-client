export const movies = [
  { id: 1, title: "Dune: Part Two", genre: "Sci-Fi", duration: "2h 46m", rating: "8.5", status: "Now Showing", color: "poster-dune", description: "Paul Atreides unites with the Fremen to seek revenge against the conspirators who destroyed his family, facing a choice that will shape the fate of the universe." },
  { id: 2, title: "Avatar: The Way of Water", genre: "Sci-Fi", duration: "3h 12m", rating: "7.6", status: "Now Showing", color: "poster-avatar", description: "Jake Sully and Neytiri explore the breathtaking oceans of Pandora while protecting their family." },
  { id: 3, title: "The Batman", genre: "Action", duration: "2h 56m", rating: "7.8", status: "Now Showing", color: "poster-batman", description: "Batman uncovers corruption in Gotham City while pursuing the Riddler." },
  { id: 4, title: "Interstellar", genre: "Sci-Fi", duration: "2h 49m", rating: "8.6", status: "Now Showing", color: "poster-interstellar", description: "A team of explorers travels through a wormhole in space to save humanity." },
  { id: 5, title: "Spider-Man: Across the Spider-Verse", genre: "Animation", duration: "2h 20m", rating: "8.7", status: "Now Showing", color: "poster-spider", description: "Miles Morales joins heroes from across the multiverse on a new adventure." },
  { id: 6, title: "Inside Out 2", genre: "Animation", duration: "1h 36m", rating: "", status: "Coming Soon", color: "poster-inside", description: "New emotions arrive as Riley enters her teenage years." },
];

export const showtimes = ["01:30 PM", "05:00 PM", "08:30 PM"];

export const appointments = [
  { id: "0142", movie: "Dune: Part Two", date: "Fri, Aug 21", time: "05:00 PM", screen: "Screen 1", seats: "A4, A5", status: "Confirmed", color: "poster-dune" },
  { id: "0141", movie: "The Batman", date: "Sat, Aug 22", time: "08:00 PM", screen: "Screen 2", seats: "C5", status: "Confirmed", color: "poster-batman" },
  { id: "0140", movie: "Interstellar", date: "Mon, Jul 14", time: "07:30 PM", screen: "Screen 1", seats: "B2, B3", status: "Completed", color: "poster-interstellar" },
];

export const adminRows = [
  { customer: "Sarah Ahmad", movie: "Dune: Part Two", date: "Aug 21", time: "05:00 PM", screen: "Screen 1", seats: "A4, A5", status: "Confirmed" },
  { customer: "Omar Khalil", movie: "The Batman", date: "Aug 22", time: "08:00 PM", screen: "Screen 2", seats: "C5", status: "Confirmed" },
  { customer: "Layla Nasser", movie: "Interstellar", date: "Jul 14", time: "07:30 PM", screen: "Screen 1", seats: "B2, B3", status: "Completed" },
  { customer: "Yousef Odeh", movie: "Spider-Verse", date: "Jul 2", time: "06:00 PM", screen: "Screen 3", seats: "D1", status: "Cancelled" },
];

