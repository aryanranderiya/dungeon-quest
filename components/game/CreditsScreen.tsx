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
              <h3 className="text-orange-400 font-bold">Game Built By</h3>
              <p>Aryan Randeriya for Frontend UI Hackathon by Outlier AI</p>
            </div>
            <div>
              <h3 className="text-orange-400 font-bold">Connect</h3>
              <p>
                LinkedIn:{" "}
                <a
                  href="https://linkedin.com/in/aryanranderiya"
                  className="text-orange-300 underline"
                >
                  aryanranderiya
                </a>
              </p>
              <p>
                GitHub:{" "}
                <a
                  href="https://github.com/aryanranderiya"
                  className="text-orange-300 underline"
                >
                  aryanranderiya
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://aryanranderiya.com"
                  className="text-orange-300 underline"
                >
                  aryanranderiya.com
                </a>
              </p>
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
