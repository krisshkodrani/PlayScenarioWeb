
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCharacterColor } from '../../utils/characterColors';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
  avatar_url?: string;
}

interface CharacterAvatarProps {
  character?: Character;
  characterName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character, characterName, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-15 h-15',
    lg: 'w-18 h-18'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
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
  const avatarUrl = character?.avatar_url;

  return (
    <Avatar className={`${sizeClasses[size]} shrink-0 shadow-lg`}>
      <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
      <AvatarFallback className={`${avatarColor} text-white font-semibold ${textSizeClasses[size]}`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default CharacterAvatar;
