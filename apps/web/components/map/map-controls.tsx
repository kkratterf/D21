
import { MinusIcon, PlusIcon } from "lucide-react";

import { useMap } from "@/context/map-context";
import { Button } from "@d21/design-system/components/ui/button";

export default function MapCotrols() {
  const { map } = useMap();

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <aside className='fixed top-8 right-6 z-10 hidden rounded-[10px] border border-default bg-elevated p-0.5 shadow-xl md:flex md:flex-col'>
      <Button variant="secondary" icon onClick={zoomIn} className="rounded-b-none">
        <PlusIcon className='h-5 w-5' />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button variant="secondary" icon onClick={zoomOut} className='rounded-t-none border-t-0'>
        <MinusIcon className='h-5 w-5' />
        <span className="sr-only">Zoom out</span>
      </Button>
    </aside>
  );
}

