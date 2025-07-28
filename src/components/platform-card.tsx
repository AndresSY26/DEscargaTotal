import { Youtube, Instagram } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

type PlatformCardProps = {
  name: string;
  description: string;
  icon: 'youtube' | 'tiktok' | 'instagram';
};

const iconMap = {
  youtube: <Youtube className="h-10 w-10 text-red-500" />,
  tiktok: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2859 3333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" className="h-10 w-10">
      <defs>
        <linearGradient id="tiktok-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#ff0050'}} />
          <stop offset="100%" style={{stopColor: '#00f2ea'}} />
        </linearGradient>
      </defs>
      <path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1735 747-55-142-117-414-117-692 0-225 47-512 142-738 95-225 203-348 356-429 203-110 491-110 709-110v524c-142 0-284 14-421 69-210 80-348 249-348 429 0 166 133 364 356 364 225 0 356-198 356-532v-1264c-198 122-388 284-388 473 0 110 38 217 102 312 301-166 491-491 491-893 2-414-253-747-600-917z" fill="url(#tiktok-gradient)"/>
    </svg>
  ),
  instagram: <Instagram className="h-10 w-10 text-pink-500" />,
};

export function PlatformCard({ name, description, icon }: PlatformCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        {iconMap[icon]}
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
