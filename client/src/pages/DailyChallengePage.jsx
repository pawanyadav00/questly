import React from 'react';
import DailyChallenge from '../components/trivia/DailyChallenge';
import styles from './dailyChallengePage.module.css';

const DailyChallengePage = () => (
  <div className={styles.pageContainer}>
    <DailyChallenge />
  </div>
);

export default DailyChallengePage;
