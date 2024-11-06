const adjectives: string[] = [
  "Mighty",
  "Swift",
  "Luminous",
  "Silent",
  "Vivid",
  "Daring",
  "Bold",
  "Clever",
  "Brave",
  "Gentle",
  "Epic",
  "Fiery",
  "Golden",
  "Witty",
  "Sly",
  "Majestic",
  "Mysterious",
  "Radiant",
  "Fearless",
  "Enigmatic",
];

const nouns: string[] = [
  "Phoenix",
  "Warrior",
  "Thunder",
  "Shadow",
  "Hunter",
  "Tiger",
  "Falcon",
  "Wizard",
  "Ninja",
  "Ranger",
  "Knight",
  "Sphinx",
  "Sparrow",
  "Dragon",
  "Viper",
  "Wolf",
  "Ghost",
  "Eagle",
  "Rebel",
  "Samurai",
];

export default function generateNickname() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
}
