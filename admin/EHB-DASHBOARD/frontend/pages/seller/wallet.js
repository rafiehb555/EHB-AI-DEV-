// 💡 Replit Auto-Placement:
// 📁 Path: /frontend/pages/seller/wallet.js

import React, { useEffect, useState } from "react";

export default function SellerWallet() {
  const [wallet, setWallet] = useState({
    balance: 0,
    totalEarned: 0,
    transactions: [],
  });

  useEffect(() => {
    // 🛠️ Replace with backend API
    setWallet({
      balance: 14500,
      totalEarned: 50000,
      transactions: [
        { id: 1, type: "Order Income", amount: 1200, date: "2025-05-01" },
        { id: 2, type: "Withdrawal", amount: -3000, date: "2025-05-05" },
      ],
    });
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💰 Wallet Summary</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p>
          💵 Current Balance: <strong>Rs {wallet.balance}</strong>
        </p>
        <p>
          📈 Total Earned: <strong>Rs {wallet.totalEarned}</strong>
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">📜 Transactions</h3>
      <table className="w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Type</th>
            <th className="py-2 px-4 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(wallet.transactions || []).map((txn) => (
            <tr key={txn.id}>
              <td className="border px-4 py-2">{txn.date}</td>
              <td className="border px-4 py-2">{txn.type}</td>
              <td className="border px-4 py-2">
                {txn.amount < 0
                  ? `- Rs ${Math.abs(txn.amount)}`
                  : `Rs ${txn.amount}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
