import { Star } from 'lucide-react'

export default function StarRatingInput({ value, onChange, error }) {
  return (
    <fieldset className="star-rating" aria-describedby={error ? 'rating-error' : undefined}>
      <legend>Rating</legend>
      <div className="star-rating__options">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            className={`star-rating__star ${rating <= value ? 'star-rating__star--selected' : ''}`}
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            aria-label={`${rating} out of 5 stars`}
            aria-pressed={rating === value}
          >
            <Star size={27} fill={rating <= value ? 'currentColor' : 'none'} strokeWidth={1.8} />
          </button>
        ))}
      </div>
      <span className="star-rating__hint">{value ? `${value} out of 5` : 'Choose a rating'}</span>
      {error && <span className="form-field-error" id="rating-error" role="alert">{error}</span>}
    </fieldset>
  )
}
