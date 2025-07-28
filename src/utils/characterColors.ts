// Generate consistent colors for characters based on their names
export const generateCharacterColor = (characterName: string): string => {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < characterName.length; i++) {
    const char = characterName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Predefined color palette that works well with our dark theme
  const colors = [
    'bg-gradient-to-br from-cyan-500 to-cyan-600',
    'bg-gradient-to-br from-violet-500 to-violet-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-amber-500 to-amber-600',
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
  ];

  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

// Character registry to maintain consistency
const characterColorRegistry = new Map<string, string>();

export const getCharacterColor = (characterName: string): string => {
  if (!characterColorRegistry.has(characterName)) {
    characterColorRegistry.set(characterName, generateCharacterColor(characterName));
  }
  return characterColorRegistry.get(characterName)!;
};