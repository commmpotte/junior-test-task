import React, { useState, useEffect } from 'react';
import styles from './adDetails.module.scss';
import { toast } from 'react-toastify';

const AdDetails = ({ad, onBackButtonClick }) => {
  const { title, city_name, district_name, price, description, images } = ad;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

 const handleBackButtonClick = () => {
    onBackButtonClick();
  };


  if (!ad) {
 return <Loading/>
 }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ad.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + ad.images.length) % ad.images.length
    );
  };

   useEffect(() => {
    console.log('Ad Details Data:', ad)
}, [ad]);

const handleLike = () => {
  setLiked(true);
  const likedAds = JSON.parse(localStorage.getItem('likedAds')) || [];
  likedAds.push(ad);
  localStorage.setItem('likedAds', JSON.stringify(likedAds));
  toast.success('Ad added to liked list');
};

const handleUnlike = () => {
  setLiked(false);
  let likedAds = JSON.parse(localStorage.getItem('likedAds')) || [];
  likedAds = likedAds.filter((likedAd) => likedAd.id !== ad.id);
  localStorage.setItem('likedAds', JSON.stringify(likedAds));
  toast.success('Ad removed from liked list');
};

useEffect(() => {
  const likedAds = JSON.parse(localStorage.getItem('likedAds')) || [];
  const isLiked = likedAds.some((likedAd) => likedAd.id === ad.id);
  setLiked(isLiked);
}, [ad]);


  return (
    <div className={styles.adDetailsContainer}>
     <div className={styles.centered}>
        <h1 className={styles.header}>Ad Details</h1>
        <button
          id="back"
            onClick={handleBackButtonClick}
          className={styles.backButton}
        >
              Back
        </button>
      </div>
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
       <div className={styles.content} >
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
        <span>
          {city_name}, {district_name}
        </span>
        <span className={styles.price}>{price} ฿</span>
      </div>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
    </div>
  );
};

export default AdDetails;
