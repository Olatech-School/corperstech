import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 24 }: LucideIconProps) {
  // Resolve icon component dynamically from lucide-react
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a default fallback icon if the specified one isn't found
    return <Icons.HelpCircle className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
