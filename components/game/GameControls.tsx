import React from "react";
import Image from "next/image";

interface GameControlsProps {
  soundEnabled: boolean;
  isPaused: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onQuitGame: () => void;
  onShowCredits: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  soundEnabled,
  isPaused,
  onToggleSound,
  onTogglePause,
  onQuitGame,
  onShowCredits,
}) => {
  return (
    <div className="absolute top-2 left-2 flex gap-2 flex-col w-fit bg-[#110805] p-6">
      <Image
        src="/ui/volume.png"
        alt="Toggle Sound"
        width={50}
        height={50}
        onClick={onToggleSound}
        className={`z-[1] relative object-contain cursor-pointer hover:scale-110 ${
          soundEnabled ? "opacity-100" : "opacity-40"
        }`}
      />
      <Image
        src={isPaused ? "/ui/play.png" : "/ui/pause.png"}
        onClick={onTogglePause}
        alt="Toggle Pause"
        width={100}
        height={100}
        className="z-[1] relative min-w-[75px] object-contain cursor-pointer hover:scale-110"
      />{" "}
      <Image
        src="/ui/exit.png"
        alt="Exit Game"
        onClick={onQuitGame}
        width={82}
        height={30}
        className="z-[1] relative object-contain cursor-pointer hover:scale-110"
      />
      <Image
        src="/ui/credits.png"
        alt="Exit Game"
        onClick={onShowCredits}
        width={95}
        height={20}
        className="z-[1] relative object-contain cursor-pointer hover:scale-110"
      />
    </div>
  );
};

export default GameControls;
