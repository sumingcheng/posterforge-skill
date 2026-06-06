export const themes = {
  'blue-copper': {
    accent: 'text-signal-blue',
    accentBg: 'bg-signal-blue',
    secondary: 'text-signal-copper',
    secondaryBg: 'bg-signal-copper',
    dark: 'bg-ink-900',
    darkText: 'text-paper-50',
    bar: 'from-signal-blue from-[0_72%] to-signal-copper to-[72%_100%]'
  },
  'green-copper': {
    accent: 'text-signal-green',
    accentBg: 'bg-signal-green',
    secondary: 'text-signal-copper',
    secondaryBg: 'bg-signal-copper',
    dark: 'bg-[#122219]',
    darkText: 'text-paper-50',
    bar: 'from-signal-green from-[0_72%] to-signal-copper to-[72%_100%]'
  },
  'red-ink': {
    accent: 'text-signal-red',
    accentBg: 'bg-signal-red',
    secondary: 'text-[#1d5c78]',
    secondaryBg: 'bg-[#1d5c78]',
    dark: 'bg-[#211815]',
    darkText: 'text-paper-50',
    bar: 'from-signal-red from-[0_72%] to-[#1d5c78] to-[72%_100%]'
  },
  graphite: {
    accent: 'text-ink-900',
    accentBg: 'bg-ink-900',
    secondary: 'text-signal-copper',
    secondaryBg: 'bg-signal-copper',
    dark: 'bg-ink-900',
    darkText: 'text-paper-50',
    bar: 'from-ink-900 from-[0_72%] to-signal-copper to-[72%_100%]'
  }
};

export function getTheme(name) {
  return themes[name] || themes['blue-copper'];
}
