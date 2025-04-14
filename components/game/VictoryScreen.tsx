import React from "react";
import Image from "next/image";

interface VictoryScreenProps {
  onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-black border-4 border-orange-700 max-w-md flex items-center flex-col">
        <Image
          src="/dungeon_quest.png"
          alt="game name"
          width={400}
          height={300}
        />
        <div className="p-10 mt-7 bg-orange-950/30">
          <h2 className="text-orange-500 font-bold text-xl mb-3 text-center">
            ⚡ QUEST COMPLETE! ⚡
          </h2>
          <ul className="text-white space-y-2 text-sm">
            <li>• You've collected all armor pieces!</li>
            <li>• Your inventory is complete</li>
            <li>• Ready for new adventures?</li>
          </ul>
        </div>
        <Image
          src="/ui/play.png"
          alt="game name"
          width={100}
          className="hover:scale-110 cursor-pointer m-6"
          height={100}
          onClick={onRestart}
        />
      </div>
    </div>
  );
};

export default VictoryScreen;
