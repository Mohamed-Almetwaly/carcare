import React from 'react';
import {
  Droplet,
  Cpu,
  Disc,
  CircleDot,
  Zap,
  Wind,
  Gauge,
  Wrench,
  Shield,
  Car,
  Activity,
  Sparkles,
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Droplet':
      return <Droplet className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Disc':
      return <Disc className={className} />;
    case 'CircleDot':
      return <CircleDot className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Gauge':
      return <Gauge className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
