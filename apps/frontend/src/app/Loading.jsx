import React from 'react';
import styles from './loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loading;
