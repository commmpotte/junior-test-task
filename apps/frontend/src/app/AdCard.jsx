import React, { useState, useEffect } from 'react';
import styles from './adCard.module.scss';

const AdCard = ({ ad, onLike, onUnlike, onAdClick }) => {
  const { city_name, title, price } = ad;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState();

  useEffect(() => {
    const likedAds = JSON.parse(localStorage.getItem('likedAds')) || [];
    const isLiked = likedAds.some((likedAd) => likedAd.id === ad.id);
    setLiked(isLiked);
  }, []);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ad.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + ad.images.length) % ad.images.length
    );
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(true);
    onLike(ad);
  };

  const handleUnlike = (e) => {
    e.stopPropagation();
    setLiked(false);
    onUnlike(ad);
  };

  const handleAdDetailsClick = () => {
    onAdClick(ad.id);
  };


  return (
    <div>
      <div className={styles.imageCarousel}>
        <div className={styles.carouselButton} onClick={handlePrevImage}>
          &lt;
        </div>
        <img
          src={ad.images[currentImageIndex].thumbnail}
          alt="Ad"
          className={styles.image}
        />
        <div className={styles.carouselButton} onClick={handleNextImage}>
          &gt;
        </div>
      </div>

      <div className={styles.content} onClick={handleAdDetailsClick}>
        <div className={styles.contentRow}>
          <div className={styles.title}>{title}</div>

          <button
            className={styles.likeButton}
            onClick={liked ? handleUnlike : handleLike}
          >
            {liked ? '❤️' : '♡'}
          </button>
        </div>

        <div className={styles.location}>
          <span>{city_name}</span>
          <span className={styles.price}>{price} ฿</span>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
