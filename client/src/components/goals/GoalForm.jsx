import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '../common/Button';
import styles from './goalForm.module.css';

const GoalForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy',
    deadline: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const goal = {
      ...formData,
      id: initialData?.id || uuidv4(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      quests: initialData?.quests || []
    };
    
    onSubmit(goal);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.header}>{initialData ? 'Edit Goal' : 'Create New Goal'}</h2>
      
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          className={styles.input}
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Learn Full Stack Development"
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
          placeholder="What do you want to achieve?"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="category">Category</label>
        <input
          className={styles.input}
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Programming, Fitness"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="difficulty">Difficulty</label>
        <select
          className={styles.select}
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="epic">Epic</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="deadline">Deadline (Optional)</label>
        <input
          className={styles.input}
          type="date"
          id="deadline"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Save Changes' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
