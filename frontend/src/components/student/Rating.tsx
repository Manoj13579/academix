import { useEffect, useState } from "react";


// ? used coz initialRating n onRating is optional. may or may not have value. user may or maynot rate
interface RatingProps {
  initialRating?: number;
  /* onRating is a function. void means it doesn't return anything only updates this parent component with new rating if rating is clicked */
  onRating?: (starValue: number) => void;
}
const Rating = ({ initialRating, onRating }: RatingProps) => {

const [rating, setRating] = useState(initialRating || 0);

const handleRatingClick = (starValue: number) => {
  setRating(starValue);
  if (onRating) {
    onRating(starValue);
  }
};

useEffect(() => {
  if (initialRating) {
    setRating(initialRating);
  }
}, [initialRating]);

  return (
    <div>
      {
        Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
          onClick={() => handleRatingClick(starValue)}>
            &#9733;
          </span>
        )
})}
    </div>
  )
}

export default Rating;
