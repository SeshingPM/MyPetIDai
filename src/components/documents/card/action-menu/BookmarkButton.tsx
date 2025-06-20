import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-10 w-10 p-1 transition-all duration-100 ${
        isBookmarked
          ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50"
          : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
      }`}
      onClick={onToggle}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      type="button"
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      {isBookmarked ? (
        <Star
          size={16}
          className="fill-yellow-400 text-yellow-500 transform scale-110 transition-transform duration-100"
        />
      ) : (
        <Star
          size={16}
          className="transition-all duration-100 hover:scale-110"
        />
      )}
    </Button>
  );
};
