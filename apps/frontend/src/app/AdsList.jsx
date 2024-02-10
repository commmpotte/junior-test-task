import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './adsList.module.scss';
import AdCard from './AdCard';
import Loading from './Loading';

const AdsList = ({ ads, onAdClick }) => {
  const [loading, setLoading] = useState(true);
  const [filteredAds, setFilteredAds] = useState(ads);
  const [filterOptions, setFilterOptions] = useState({
    minPrice: '',
    maxPrice: '',
    city: '',
    district: '',
    searchText: '',
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const filtersRef = useRef(null);

  const applyFilters = () => {
    let filtered = ads.filter((ad) => {
      let meetsCriteria = true;
      if (filterOptions.minPrice && ad.price < filterOptions.minPrice) {
        meetsCriteria = false;
      }
      if (filterOptions.maxPrice && ad.price > filterOptions.maxPrice) {
        meetsCriteria = false;
      }
      if (
        filterOptions.city &&
        ad.city_name &&
        !ad.city_name.toLowerCase().includes(filterOptions.city.toLowerCase())
      ) {
        meetsCriteria = false;
      }
      if (
        filterOptions.district &&
        ad.district_name &&
        !ad.district_name
          .toLowerCase()
          .includes(filterOptions.district.toLowerCase())
      ) {
        meetsCriteria = false;
      }
      if (filterOptions.searchText) {
        const searchWords = filterOptions.searchText.toLowerCase().split(' ');
        let foundMatch = false;
        for (const word of searchWords) {
          const searchRegex = new RegExp(word, 'i');
          if (
            (ad.title && searchRegex.test(ad.title.toLowerCase())) ||
            (ad.description &&
              searchRegex.test(ad.description.toLowerCase())) ||
            (ad.city_name && searchRegex.test(ad.city_name.toLowerCase())) ||
            (ad.district_name &&
              searchRegex.test(ad.district_name.toLowerCase()))
          ) {
            foundMatch = true;
            break;
          }
        }
        if (!foundMatch) {
          meetsCriteria = false;
        }
      }
      return meetsCriteria;
    });
    setFilteredAds(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value.trim(),
    });
  };

  const handleApplyFilters = () => {
    applyFilters();
    setFiltersVisible(false);
  };

  const handleResetFilters = () => {
    setFilterOptions({
      minPrice: '',
      maxPrice: '',
      city: '',
      district: '',
      searchText: '',
    });
    setFilteredAds(ads);
    setFiltersVisible(false);
  };

  useEffect(() => {
    setLoading(false);
    applyFilters();
  }, [ads, filterOptions]);

  if (loading) {
    return <Loading />;
  }

  const handleLike = (ad) => {
    const likedAds = JSON.parse(localStorage.getItem('likedAds')) || [];
    likedAds.push(ad);
    localStorage.setItem('likedAds', JSON.stringify(likedAds));
    toast.success('Ad added to liked list');
  };

  const handleUnlike = (ad) => {
    let likedAds = JSON.parse(localStorage.getItem('likedAds')) || [];
    likedAds = likedAds.filter((likedAd) => likedAd.id !== ad.id);
    localStorage.setItem('likedAds', JSON.stringify(likedAds));
    toast.success('Ad removed from liked list');
  };

  return (
    <div className={styles.adsListContainer}>
      <div className={styles.centered}>
        <h1 className={styles.header}>List of ads</h1>
        <button
          id="filtersButton"
          onClick={() => setFiltersVisible(!filtersVisible)}
          className={styles.filtersButton}
        >
          Filters button
        </button>
      </div>
      {filtersVisible && (
        <div
          ref={filtersRef}
          className={`${styles.filtersContainer} ${styles.inputContainer}`}
        >
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filterOptions.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filterOptions.maxPrice}
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={filterOptions.city}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="district"
            placeholder="District"
            value={filterOptions.district}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="searchText"
            placeholder="Search"
            value={filterOptions.searchText}
            onChange={handleFilterChange}
            className={styles.searchInput}
          />
          <div className={styles.buttonContainer}>
            <button className={styles.applyButton} onClick={handleApplyFilters}>
              Apply
            </button>
            <button className={styles.resetButton} onClick={handleResetFilters}>
              Reset
            </button>
          </div>
        </div>
      )}
      <div className={styles.adCardsContainer}>
        {filteredAds.map((ad) => (
          <div className={styles.adCard} key={ad.id}>
            <AdCard
              ad={ad}
              onLike={handleLike}
              onUnlike={handleUnlike}
              onAdClick={onAdClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsList;
