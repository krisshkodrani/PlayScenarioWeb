
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getCharacterColor } from '../../utils/characterColors';
import { AVATAR_SIZES, AVATAR_TEXT_SIZES, AvatarSize } from '@/utils/imageUtils';

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
  size?: AvatarSize;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character, characterName, size = 'md' }) => {

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
    <Avatar className={`${AVATAR_SIZES[size]} shrink-0 shadow-lg`}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={`${avatarColor} text-white font-semibold ${AVATAR_TEXT_SIZES[size]}`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default CharacterAvatar;
