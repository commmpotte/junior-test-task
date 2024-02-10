'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import AdsList from './AdsList';
import AdDetails from './AdDetails';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const Index = () => {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [currentPage, setCurrentPage] = useState('adsList');
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAdClick = (adId) => {
    const selectedAd = ads.find((ad) => ad.id === adId); 
     setSelectedAd(selectedAd); 
      setSelectedAdId(adId);
    setCurrentPage('adDetails'); 
  };

  const handleBackButtonClick = () => {
    setSelectedAdId(null);
    setCurrentPage('adsList');
  };

useEffect(() => {
  const fetchAds = async () => {
    try {
      const response = await axios.get('/api/ads');
      setAds(response.data.results);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error('Server error. Please try again later.');
        const retry = window.confirm('An error occurred. Retry fetching ads?');
        if (retry) {
          fetchAds();
        } else {
        }
      } else {
        setError('Error fetching ads. Please try again later.');
      }
      setLoading(false);
    }
  };
  fetchAds();
}, []);


  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <ToastContainer />
      {currentPage === 'adsList' && (
        <AdsList ads={ads} onAdClick={handleAdClick} />
      )}

      {currentPage === 'adDetails' && selectedAdId && (
        <AdDetails ad={selectedAd} onBackButtonClick={handleBackButtonClick} />
      )}
    </div>
  );
};

export default Index;
