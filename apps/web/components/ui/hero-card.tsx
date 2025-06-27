

import { NumberTicker } from '@/components/ui/number-ticker';
import { cn, } from '@d21/design-system/lib/utils';

interface HeroCardProps {
  title: string;
  number?: string | number;
}

const HeroCard = ({ title, number }: HeroCardProps) => {
  return (
    <div
      className='flex flex-row items-center justify-between rounded-xl border border-border p-4'
    >
      <p className="font-brand text-lg">{title}</p>
      {number && (
        <NumberTicker
          className={cn(
            'font-mono text-base text-description'
          )}
          value={Number(number)}
        />
      )}
    </div>
  );
};

export default HeroCard;
