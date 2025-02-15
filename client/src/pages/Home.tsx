import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { songs } from "@/lib/songs";

export default function Home() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">
          Meme Coin Rhythm
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {songs.map((song) => (
            <Card key={song.id} className="bg-white/10 backdrop-blur">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">{song.title}</h2>
                <p className="text-gray-300 mb-4">{song.artist}</p>
                <Button 
                  onClick={() => setLocation(`/game/${song.id}`)}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-600 hover:opacity-90"
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}