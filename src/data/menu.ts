/**
 * Approved V1 menu structure. Labels and order come straight from the build
 * spec; do not reorder or add items without design approval.
 * No webOS app IDs live here; see platform/targets.ts.
 */

export type SectionId = 'watchTv' | 'streaming' | 'gaming' | 'photos' | 'views';

export type LaunchTargetId = 'liveTv' | 'lgChannels' | 'plex' | 'hulu' | 'peacock' | 'netflix';

export type IconName =
  | 'tv'
  | 'play'
  | 'gamepad'
  | 'photo'
  | 'sunset'
  | 'antenna'
  | 'channels'
  | 'star'
  | 'home';

export type CardAction =
  | { kind: 'launch'; targetId: LaunchTargetId }
  | { kind: 'info'; title: string; message: string }
  | { kind: 'close' };

export interface MenuCard {
  id: string;
  label: string;
  /** null renders a text-only tile (used for third-party apps without licensed art). */
  icon: IconName | null;
  action: CardAction;
}

export interface MenuSection {
  id: SectionId;
  label: string;
  icon: IconName;
  heading: string;
  subtitle: string;
  /** True for sections whose detailed design has not been approved yet. */
  placeholder: boolean;
  note?: string;
  cards: MenuCard[];
}

const backToHome: MenuCard = {
  id: 'close',
  label: 'Back to Home',
  icon: 'home',
  action: { kind: 'close' },
};

export const sections: readonly MenuSection[] = [
  {
    id: 'watchTv',
    label: 'Watch TV',
    icon: 'tv',
    heading: 'WATCH TV',
    subtitle: 'Choose what you want to watch.',
    placeholder: false,
    cards: [
      { id: 'liveTv', label: 'Live TV', icon: 'antenna', action: { kind: 'launch', targetId: 'liveTv' } },
      {
        id: 'lgChannels',
        label: 'LG Channels',
        icon: 'channels',
        action: { kind: 'launch', targetId: 'lgChannels' },
      },
      {
        id: 'favorites',
        label: 'Favorites',
        icon: 'star',
        action: {
          kind: 'info',
          title: 'Favorites',
          message: 'Favorites will be available after TV setup.',
        },
      },
    ],
  },
  {
    id: 'streaming',
    label: 'Streaming',
    icon: 'play',
    heading: 'STREAMING',
    subtitle: 'Choose an app to watch.',
    placeholder: false,
    cards: [
      { id: 'plex', label: 'Plex', icon: null, action: { kind: 'launch', targetId: 'plex' } },
      { id: 'hulu', label: 'Hulu', icon: null, action: { kind: 'launch', targetId: 'hulu' } },
      { id: 'peacock', label: 'Peacock', icon: null, action: { kind: 'launch', targetId: 'peacock' } },
      { id: 'netflix', label: 'Netflix', icon: null, action: { kind: 'launch', targetId: 'netflix' } },
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming & HDMI',
    icon: 'gamepad',
    heading: 'GAMING & HDMI',
    subtitle: 'Coming soon',
    placeholder: true,
    note: 'Game consoles and HDMI devices will appear here once they are set up on this TV.',
    cards: [backToHome],
  },
  {
    id: 'photos',
    label: 'Family Photos',
    icon: 'photo',
    heading: 'FAMILY PHOTOS',
    subtitle: 'Coming soon',
    placeholder: true,
    note: 'Family albums and slideshows will appear here in a future update.',
    cards: [backToHome],
  },
  {
    id: 'views',
    label: 'Resort Views',
    icon: 'sunset',
    heading: 'RESORT VIEWS',
    subtitle: 'Coming soon',
    placeholder: true,
    note: 'Additional resort scenery will be available in a future update.',
    cards: [backToHome],
  },
];
