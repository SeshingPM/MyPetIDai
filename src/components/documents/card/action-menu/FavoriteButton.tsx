import React from "react";
import { BookmarkButton } from "./BookmarkButton";

// This component exists for backward compatibility
// It maps the old prop names to the new BookmarkButton props
interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
}) => {
  return <BookmarkButton isBookmarked={isFavorite} onToggle={onToggle} />;
};
