import { isKnownPlatform, SocialIcon } from '@/components/SocialIcon';
import { getIcon } from '@/lib/icons';

export function ConfiguredIcon({ icon, size = 14 }: { icon?: string; size?: number }) {
  if (!icon) {
    return null;
  }

  if (isKnownPlatform(icon)) {
    return <SocialIcon platform={icon} size={size} />;
  }

  const Icon = getIcon(icon);
  return Icon ? <Icon size={size} aria-hidden="true" /> : null;
}
