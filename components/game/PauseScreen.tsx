import React from "react";
import Image from "next/image";

interface PauseScreenProps {
  onResume: () => void;
  onQuit: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onQuit }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-10">
      <div className="bg-black border-4 border-orange-700 max-w-md flex items-center flex-col">
        <Image
          src="/dungeon_quest.png"
          alt="game name"
          width={400}
          height={300}
        />
        <div className="p-10 mt-7 bg-orange-950/30">
          <h2 className="text-orange-500 font-bold text-xl mb-3 text-center">
            GAME PAUSED
          </h2>
          <ul className="text-white space-y-2 text-sm">
            <li>• Press play to continue your quest</li>
            <li>• Or exit to return to the main menu</li>
          </ul>
        </div>
        <div className="flex gap-4 my-4">
          <Image
            src="/ui/play.png"
            onClick={onResume}
            alt="game name"
            width={100}
            height={100}
            className="z-[1] relative hover:scale-110 cursor-pointer"
          />
          <Image
            src="/ui/exit.png"
            onClick={onQuit}
            alt="game name"
            width={100}
            height={100}
            className="z-[1] relative hover:scale-110 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
