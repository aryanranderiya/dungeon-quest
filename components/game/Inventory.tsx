import React from "react";
import Image from "next/image";
import { GameItem } from "@/lib/game-types";

interface InventoryProps {
  items: GameItem[];
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
  return (
    <div className="bg-[#110805] z-[1] relative h-full w-full md:min-w-[240px] md:max-w-[240px] p-6 overflow-y-auto">
      <div className="flex flex-col items-center mb-4">
        <Image
          src="/ui/inventory.png"
          alt="Inventory"
          width={140}
          height={140}
          className="object-contain"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative p-2 border-2 ${
              item.collected ? "border-yellow-500" : "border-gray-800"
            } rounded-md flex items-center justify-center`}
          >
            <Image
              src={`/inventory/${item.id}.png`}
              width={50}
              height={50}
              alt={item.id}
              className={item.collected ? "opacity-100" : "opacity-30"}
            />
            {item.collected && (
              <Image
                src="/ui/check.png"
                width={20}
                height={20}
                alt="Collected"
                className="absolute top-1 right-1"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
