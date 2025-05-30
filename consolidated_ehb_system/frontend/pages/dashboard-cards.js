import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardCards() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/cards/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(res.data.cards);
    };
    fetchCards();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {cards.map((card, index) => (
        <div key={index} className="p-4 border rounded shadow bg-white">
          <h2 className="text-lg font-bold">{card.title}</h2>
          <p>{card.description}</p>
          <p className="text-sm italic text-gray-600">{card.status}</p>
          <a href={card.url} className="text-blue-500 underline">Open</a>
        </div>
      ))}
    </div>
  );
}
