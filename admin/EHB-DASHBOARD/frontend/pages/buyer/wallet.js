// 💡 Replit Auto-Placement:
// 📁 Path: /frontend/pages/buyer/wallet.js

import React, { useEffect, useState } from "react";

export default function BuyerWallet() {
  const [wallet, setWallet] = useState({
    balance: 2200,
    totalSpent: 8300,
    transactions: [],
  });

  useEffect(() => {
    // 🔁 Replace with real API
    setWallet({
      balance: 2200,
      totalSpent: 8300,
      transactions: [
        { id: 1, type: "Purchase", amount: -700, date: "2025-05-01" },
        { id: 2, type: "Wallet Top-up", amount: 3000, date: "2025-05-03" },
      ],
    });
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">
        💳 Wallet Summary
      </h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p>
          💰 Current Balance: <strong>Rs {wallet.balance}</strong>
        </p>
        <p>
          🧾 Total Spent: <strong>Rs {wallet.totalSpent}</strong>
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-2">📜 Transactions</h3>
      <table className="w-full border bg-white">
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
