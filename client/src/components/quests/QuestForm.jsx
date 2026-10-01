import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../common/Button';
import styles from './questForm.module.css';

const QuestForm = ({ goalId, initialData, availableQuests, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'learn',
    difficulty: 'easy',
    xpReward: 50,
    coinReward: 10,
    prerequisiteId: '',
    skillId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const DIFFICULTY_REWARDS = {
    easy: { xpReward: 50, coinReward: 10 },
    medium: { xpReward: 100, coinReward: 25 },
    hard: { xpReward: 250, coinReward: 50 },
    epic: { xpReward: 500, coinReward: 100 }
  };

  const handleDifficultyChange = (e) => {
    const diff = e.target.value;
    const rewards = DIFFICULTY_REWARDS[diff] || DIFFICULTY_REWARDS.easy;
    setFormData(prev => ({ ...prev, difficulty: diff, ...rewards }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const quest = {
      ...formData,
      id: initialData?.id || uuidv4(),
      goalId,
      status: formData.prerequisiteId ? 'locked' : (initialData?.status || 'available'),
      createdAt: initialData?.createdAt || new Date().toISOString()
    };
    
    onSubmit(quest);
  };

  // Filter out the current quest from prerequisites to prevent self-dependency
  const validPrerequisites = availableQuests?.filter(q => q.id !== initialData?.id) || [];

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.header}>{initialData ? 'Edit Quest' : 'Create New Quest'}</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          className={styles.input}
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Read documentation on React Context"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          className={styles.textarea}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What exactly needs to be done?"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="type">Type</label>
          <select className={styles.select} id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="learn">Learn</option>
            <option value="build">Build</option>
            <option value="practice">Practice</option>
            <option value="challenge">Challenge</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="difficulty">Difficulty</label>
          <select className={styles.select} id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="epic">Epic</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label className={styles.label}>XP Reward</label>
          <input className={styles.input} type="number" value={formData.xpReward} disabled />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Coin Reward</label>
          <input className={styles.input} type="number" value={formData.coinReward} disabled />
        </div>
      </div>

      {validPrerequisites.length > 0 && (
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="prerequisiteId">Prerequisite Quest (Optional)</label>
          <select 
            className={styles.select} 
            id="prerequisiteId" 
            name="prerequisiteId" 
            value={formData.prerequisiteId} 
            onChange={handleChange}
          >
            <option value="">None (Available immediately)</option>
            {validPrerequisites.map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>
        </div>
      )}



      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Save Changes' : 'Create Quest'}
        </Button>
      </div>
    </form>
  );
};

export default QuestForm;
