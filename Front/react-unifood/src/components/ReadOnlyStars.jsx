import { Star } from "lucide-react";

function ReadOnlyStars({ value }) {
    const fullStars = Math.floor(value);
    const hasHalf = value % 1 >= 0.5;

    return (
        <div className="flex space-x-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
            {hasHalf && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 opacity-50" />}
            {[...Array(5 - fullStars - (hasHalf ? 1 : 0))].map((_, i) => (
                <Star key={i + 5} className="w-5 h-5 text-gray-300" />
            ))}
        </div>
    );
}

export default ReadOnlyStars;
