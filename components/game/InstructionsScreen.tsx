import React from "react";
import Image from "next/image";

interface InstructionsScreenProps {
  onClose: () => void;
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onClose }) => {
  return (
    <div
      className="absolute z-[2] inset-0 bg-black/85 flex flex-col items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div className="bg-black border-4 border-orange-700 max-w-md flex items-center flex-col">
        <Image
          src="/dungeon_quest.png"
          alt="game name"
          width={400}
          height={300}
        />
        <div className="p-10 mt-7 bg-orange-950/30">
          <h2 className="text-orange-500 font-bold text-xl mb-3 text-center">
            HOW TO PLAY
          </h2>
          <ul className="text-white space-y-2 text-sm">
            <li>• Move with WASD or Arrow Keys</li>
            <li>• Collect all 5 armor pieces</li>
            <li>• Complete your inventory</li>
          </ul>
        </div>
        <Image
          src="/ui/start.png"
          alt="game name"
          width={100}
          className="hover:scale-110"
          height={100}
        />
      </div>
    </div>
  );
};

export default InstructionsScreen;
