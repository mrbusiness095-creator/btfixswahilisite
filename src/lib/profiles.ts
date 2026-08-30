export type Profile = {
  id: number;
  name: string;
  country: string;
  flag: string;
  status: "Active now" | "Away";
  rating: number;
  minutes: number;
  wants: string;
  earn: number;
  avatar: string;
};

const COUNTRIES: Array<[string, string]> = [
  ["New Zealand", "🇳🇿"],
  ["United Kingdom", "🇬🇧"],
  ["USA", "🇺🇸"],
  ["Canada", "🇨🇦"],
  ["Australia", "🇦🇺"],
  ["Germany", "🇩🇪"],
  ["France", "🇫🇷"],
  ["Italy", "🇮🇹"],
  ["Spain", "🇪🇸"],
  ["Belgium", "🇧🇪"],
  ["Netherlands", "🇳🇱"],
  ["Sweden", "🇸🇪"],
  ["Norway", "🇳🇴"],
  ["Denmark", "🇩🇰"],
  ["Finland", "🇫🇮"],
  ["Switzerland", "🇨🇭"],
  ["Austria", "🇦🇹"],
  ["Ireland", "🇮🇪"],
  ["Portugal", "🇵🇹"],
  ["Greece", "🇬🇷"],
  ["Brazil", "🇧🇷"],
  ["Mexico", "🇲🇽"],
  ["Japan", "🇯🇵"],
];

const WANTS = [
  "Casual Chat",
  "English Practice",
  "Travel Discussion",
  "Music Chat",
  "Sports & Football Chat",
  "Vacation & Beach Chat",
  "Cooking & Recipe Swap",
  "Tech & Startup Talk",
  "Swahili Conversation Exchange",
  "Friendly Voice Calls",
  "Cultural Exchange Chat",
  "Daily Chat Companion",
];

const NAMES = [
  "Ronald B.", "Sophia M.", "Liam K.", "Emma S.", "Lucas T.", "Olivia R.",
  "Ethan L.", "Ava D.", "Mason W.", "Isabella C.", "Logan P.", "Mia H.",
  "Jackson N.", "Charlotte G.", "Sebastian F.", "Amelia V.", "Daniel A.",
  "Harper J.", "Henry E.", "Evelyn O.", "Owen Q.", "Aria U.", "Leo X.",
  "Layla Y.", "Felix Z.", "Nora B.", "Oscar M.", "Hazel K.", "Theo S.",
  "Stella T.", "Caleb R.", "Ruby L.", "Nathan D.", "Lily W.", "Gabriel C.",
  "Zoe P.", "Isaac H.", "Aurora N.", "Marcus G.", "Violet F.", "Julian V.",
  "Phoebe A.", "Levi J.", "Maya E.", "Wyatt O.", "Grace Q.", "Aiden U.",
  "Ivy X.", "Oliver Y.", "Ella Z.",
];

export const PROFILES: Profile[] = NAMES.map((name, i) => {
  const country = COUNTRIES[i % COUNTRIES.length]!;
  return {
    id: i + 1,
    name,
    country: country[0],
    flag: country[1],
    status: (i + 1) % 5 === 0 ? "Away" : "Active now",
    rating: 4.3 + ((i % 5) * 0.1),
    minutes: 15 + ((i * 11) % 60),
    wants: WANTS[i % WANTS.length]!,
    earn: 15000 + i * 1373,
    avatar: `https://i.pravatar.cc/240?img=${i + 1}`,
  };
});

export const REGISTER_URL = "https://kozenasite.site/register?ref=NOBLYBOY";

export const formatTZS = (n: number) => n.toLocaleString("en-US");
