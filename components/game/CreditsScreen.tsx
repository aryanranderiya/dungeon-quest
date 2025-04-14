import React from "react";
import Image from "next/image";

interface CreditsScreenProps {
  onClose: () => void;
}

const CreditsScreen: React.FC<CreditsScreenProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
      <div className="bg-black border-4 border-orange-700 max-w-md flex items-center flex-col">
        <Image
          src="/dungeon_quest.png"
          alt="game name"
          width={400}
          height={300}
        />
        <div className="p-10 mt-7 bg-orange-950/30">
          <h2 className="text-orange-500 font-bold text-xl mb-3 text-center">
            CREDITS
          </h2>
          <div className="text-white space-y-4 text-sm">
            <div>
              <h3 className="text-orange-400 font-bold">Game Development</h3>
              <p>Created by Pixel Quest Team</p>
            </div>
            <div>
              <h3 className="text-orange-400 font-bold">Artwork</h3>
              <p>Pixel Art by Digital Dreamers</p>
            </div>
            <div>
              <h3 className="text-orange-400 font-bold">Music & Sound</h3>
              <p>Audio by Retro Sounds Studio</p>
            </div>
            <div>
              <h3 className="text-orange-400 font-bold">Special Thanks</h3>
              <p>To all the pixel art enthusiasts and retro gamers!</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mb-4 bg-orange-700 hover:bg-orange-600 text-white p-2 px-4 rounded flex items-center gap-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CreditsScreen;
