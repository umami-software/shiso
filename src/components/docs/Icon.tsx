import { getIcon } from '@/lib/icons';
import styles from './docs.module.css';

export interface IconProps {
  icon?: string;
  src?: string;
  color?: string;
  size?: number;
  className?: string;
}

export function Icon({ icon, src, color, size = 16, className }: IconProps) {
  const classes = className ? `${styles.icon} ${className}` : styles.icon;

  if (src) {
    return <img src={src} alt="" width={size} height={size} className={classes} />;
  }

  if (!icon) {
    return null;
  }

  const Component = getIcon(icon);

  if (!Component) {
    return null;
  }

  return <Component size={size} color={color} className={classes} />;
}
