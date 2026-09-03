import Card from '../components/common/Card';
import styles from './questsPage.module.css';

const QuestsPage = () => {
  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>All Quests</h1>
      <p className={styles.subtitle}>Explore quests across all goals.</p>
      <Card className={styles.placeholder}>Coming soon...</Card>
    </div>
  );
};

export default QuestsPage;
