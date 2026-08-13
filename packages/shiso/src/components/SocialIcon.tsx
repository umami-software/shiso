import { Globe, Podcast } from 'lucide-react';
import {
  siBluesky,
  siDiscord,
  siFacebook,
  siGithub,
  siInstagram,
  siMedium,
  siReddit,
  siTelegram,
  siThreads,
  siX,
  siYcombinator,
  siYoutube,
} from 'simple-icons';

interface BrandIcon {
  path: string;
}

/**
 * Slack and LinkedIn were removed from both simple-icons and lucide for
 * trademark reasons, so their (widely mirrored) 24x24 paths live here.
 */
const LOCAL_BRANDS: Record<string, BrandIcon> = {
  slack: {
    path: 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z',
  },
  linkedin: {
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
};

/**
 * Icons for every platform name the footer `socials` config accepts. Brand
 * marks come from simple-icons; generic ones (website, podcast) fall back
 * to lucide.
 */
const BRAND_ICONS: Record<string, BrandIcon> = {
  x: siX,
  twitter: siX,
  'x-twitter': siX,
  github: siGithub,
  facebook: siFacebook,
  youtube: siYoutube,
  discord: siDiscord,
  instagram: siInstagram,
  'hacker-news': siYcombinator,
  medium: siMedium,
  telegram: siTelegram,
  bluesky: siBluesky,
  threads: siThreads,
  reddit: siReddit,
  ...LOCAL_BRANDS,
};

const LUCIDE_ICONS = {
  website: Globe,
  'earth-americas': Globe,
  podcast: Podcast,
} as const;

export function isKnownPlatform(platform: string): boolean {
  return platform in BRAND_ICONS || platform in LUCIDE_ICONS;
}

export function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const brand = BRAND_ICONS[platform];

  if (brand) {
    return (
      <svg
        role="img"
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
      >
        <path d={brand.path} />
      </svg>
    );
  }

  const Lucide = LUCIDE_ICONS[platform as keyof typeof LUCIDE_ICONS] || Globe;

  return <Lucide size={size} aria-hidden="true" />;
}
