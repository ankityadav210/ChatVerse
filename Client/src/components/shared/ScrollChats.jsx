import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const ScrollChats = () => {
  const [calculatedHeight, setCalculatedHeight] = useState(0);
  useEffect(() => {
    const windowHeight = window.innerHeight;
    const newHeight =
      windowHeight -
      4 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    setCalculatedHeight(newHeight);
  });
  return (
    <ScrollArea
      style={{ height: `${calculatedHeight}px` }}
      className="h-screen bgColor-black overflow-y-hidden w-160 rounded-md border"
    >
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-lg">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ScrollChats;
