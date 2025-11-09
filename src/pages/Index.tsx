import { useEffect, useRef, useState } from 'react';
import { Game } from '@/lib/game';
import { Volume2, VolumeX } from 'lucide-react';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game
    const game = new Game(canvas);
    gameRef.current = game;

    // Game loop
    let animationFrameId: number;
    const gameLoop = () => {
      game.update();
      game.draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const toggleMute = () => {
    if (gameRef.current) {
      const audio = gameRef.current.getAudioManager();
      const muted = audio.toggleMute();
      setIsMuted(muted);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Game container */}
      <div className="relative z-10">
        {/* Arcade cabinet frame */}
        <div className="bg-gradient-to-b from-muted to-background p-8 rounded-lg shadow-2xl border-4 border-primary">
          {/* Screen bezel */}
          <div className="bg-black p-4 rounded border-2 border-muted">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="block bg-space-dark"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Control panel */}
          <div className="mt-4 flex items-center justify-between px-4">
            <div className="text-primary pixel-text text-sm">
              <div>← → or A D: MOVE</div>
              <div>SPACEBAR: FIRE</div>
            </div>

            <button
              onClick={toggleMute}
              className="p-3 rounded bg-muted hover:bg-primary hover:text-primary-foreground transition-colors border-2 border-primary"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Game info */}
        <div className="mt-6 text-center pixel-text text-primary arcade-glow">
          <h1 className="text-2xl font-bold mb-2">SPACE INVADERS</h1>
          <p className="text-sm text-muted-foreground">DEFEND EARTH FROM THE ALIEN INVASION!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
