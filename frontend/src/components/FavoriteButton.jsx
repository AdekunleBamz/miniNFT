function FavoriteButton({ tokenId, isFavorite, onToggle }) {
  return (
    <button
      className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(tokenId);
      }}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="favorite-icon">{isFavorite ? '❤️' : '🤍'}</span>
    </button>
  );
}

export default FavoriteButton;
