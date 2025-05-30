import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Learning() {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [answer, setAnswer] = useState('');
  const [badge, setBadge] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/lessons', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLessons(res.data));
  }, []);

  const submitAnswer = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/lessons/submit', {
      lessonId: selectedLesson._id,
      answer
    }, { headers: { Authorization: `Bearer ${token}` } });
    setBadge(res.data.badge || 'No badge earned');
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Learning & Skill Badge</h1>
      <ul className="list-disc pl-6">
        {lessons.map((lesson, i) => (
          <li key={i}>
            <button onClick={() => setSelectedLesson(lesson)} className="text-blue-600 underline">{lesson.title}</button>
          </li>
        ))}
      </ul>

      {selectedLesson && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{selectedLesson.title}</h2>
          <p className="mb-2">{selectedLesson.content}</p>
          <input className="border p-2 w-full mb-2" placeholder="Your Answer" value={answer} onChange={e => setAnswer(e.target.value)} />
          <button onClick={submitAnswer} className="bg-green-600 text-white px-4 py-2">Submit</button>
          {badge && <p className="mt-2">🎖 Badge: {badge}</p>}
        </div>
      )}
    </div>
  );
}
