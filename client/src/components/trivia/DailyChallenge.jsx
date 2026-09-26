import React, { useEffect, useState } from 'react';
import styles from './dailyChallenge.module.css';

const DailyChallenge = () => {
  const [trivia, setTrivia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrivia = async () => {
      try {
        const res = await fetch('/api/trivia');
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setTrivia(data.results[0]);
        } else {
          setError('No trivia data received');
        }
      } catch (err) {
        setError('Failed to fetch trivia');
      } finally {
        setLoading(false);
      }
    };
    fetchTrivia();
  }, []);

  if (loading) return <div className={styles.container}>Loading daily challenge...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  const { question, correct_answer, incorrect_answers, category, difficulty, type } = trivia;
  const answers = type === 'multiple' ? [...incorrect_answers, correct_answer].sort() : [correct_answer];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daily Trivia Challenge</h1>
      <p className={styles.category}>Category: {category} | Difficulty: {difficulty}</p>
      <div className={styles.question} dangerouslySetInnerHTML={{ __html: question }} />
      <ul className={styles.answerList}>
        {answers.map((ans, idx) => (
          <li key={idx} className={styles.answerItem} dangerouslySetInnerHTML={{ __html: ans }} />
        ))}
      </ul>
      <p className={styles.note}>Answer will be stored on completion of the quest in future updates.</p>
    </div>
  );
};

export default DailyChallenge;
