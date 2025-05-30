import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('Pending');

  const fetchInvoices = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/invoices', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setInvoices(res.data);
  };

  const createInvoice = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/invoices', { amount, status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAmount(0); setStatus('Pending');
    fetchInvoices();
  };

  useEffect(() => { fetchInvoices(); }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Invoice System</h1>
      <input type="number" placeholder="Amount" className="border p-2 w-full mb-2" value={amount} onChange={e => setAmount(e.target.value)} />
      <select className="border p-2 w-full mb-2" value={status} onChange={e => setStatus(e.target.value)}>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Overdue">Overdue</option>
      </select>
      <button onClick={createInvoice} className="bg-blue-600 text-white px-4 py-2">Create Invoice</button>

      <h2 className="text-xl font-semibold mt-6">Your Invoices</h2>
      <ul className="list-disc pl-6 mt-2">
        {invoices.map((inv, i) => (
          <li key={i}><b>{inv.amount}</b> coins - {inv.status} - {new Date(inv.createdAt).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
}
