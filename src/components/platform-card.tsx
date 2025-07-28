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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.32-4.2-2.32-6.53.01-3.49.01-6.98.02-10.47.04-1.31.54-2.6 1.45-3.64 1.12-1.27 2.7-1.87 4.31-1.92 1.29-.04 2.58.05 3.87.05zm-3.32 8.44c-1.53.01-2.91.02-4.39.02v3.98c1.48 0 2.86-.01 4.39-.02-.01-1.32-.01-2.66 0-3.98z"/>
    </svg>
  ),
  instagram: <Instagram className="h-10 w-10 text-pink-500" />,
};

export function PlatformCard({ name, description, icon }: PlatformCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
