
import React from 'react';
import { getCharacterColor } from '../../utils/characterColors';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface CharacterAvatarProps {
  character?: Character;
  characterName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character, characterName, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  // Get initials from character name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Use either provided character or characterName
  const name = character?.name || characterName || 'Unknown';
  const avatarColor = character?.avatar_color || getCharacterColor(name);

  return (
    <div 
      className={`${sizeClasses[size]} ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold ${textSizeClasses[size]} shrink-0 shadow-lg`}
    >
      {getInitials(name)}
    </div>
  );
};

export default CharacterAvatar;
