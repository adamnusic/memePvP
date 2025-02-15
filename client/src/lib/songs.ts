export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export const songs: Song[] = [
  {
    id: "1000000darling",
    title: "1000000 Darling",
    artist: "Unknown",
    url: "/attached_assets/1000000Darling.mp3"
  },
  {
    id: "aveknew",
    title: "Ave Knew",
    artist: "Unknown",
    url: "/attached_assets/aveknew.mp3"
  },
  {
    id: "banhammer",
    title: "Ban Hammer",
    artist: "Deadmau5",
    url: "/attached_assets/Ban Hammer - Deadmau5.mp3"
  },
  {
    id: "burningmeout",
    title: "Burning Me Out",
    artist: "Unknown",
    url: "/attached_assets/BurningMeOut.mp3"
  },
  {
    id: "comearound",
    title: "Come Around Be So Lucky",
    artist: "Unknown",
    url: "/attached_assets/ComeAroundBeSoLucky.mp3"
  }
];
