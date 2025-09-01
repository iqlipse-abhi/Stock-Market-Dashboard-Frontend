"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Stock = {
  ticker: string;
  exchange: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  cmp: number | null;
  pe: number | null;
  latestEarnings: number | string | null;
  investment: number;
  presentValue: number;
  gainLoss: number;
  portfolioPercent: number;
};

type SectorSummary = {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  items: Stock[];
};

type Snapshot = {
  ts: number;
  stocks: Stock[];
  sectorSummary: SectorSummary[];
};

export default function PortfolioTable() {
  const [data, setData] = useState<Snapshot | null>(null);

  async function load() {
    try {
      const res = await axios.get<Snapshot>("https://stock-market-dashboard-backend-meco.onrender.com/portfolio");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  if (!data) return <div className="p-6 text-slate-200">Loading portfolio…</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-100">
            Portfolio Dashboard
          </h1>
          <div className="text-sm text-slate-300">
            Last updated: {new Date(data.ts).toLocaleTimeString()}
          </div>
        </div>

        {/* Sectors */}
        {data.sectorSummary.map((sec) => (
          <div
            key={sec.sector}
            className="mb-8 border rounded-xl p-4 shadow bg-slate-800 border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-100">
                {sec.sector}
              </h2>
              <div className="text-sm text-slate-300">
                Holdings: <span className="font-medium">{sec.items.length}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-4 text-sm">
              <div>
                <span className="text-slate-400">Investment: </span>
                <span className="font-semibold text-slate-100">
                  ₹{sec.totalInvestment.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Present Value: </span>
                <span className="font-semibold text-slate-100">
                  ₹{sec.totalPresentValue.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Gain/Loss: </span>
                <span
                  className={`font-semibold ${
                    sec.totalGainLoss >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ₹{sec.totalGainLoss.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-700 text-slate-200 text-xs">
                  <tr>
                    <th className="p-2 text-left">Ticker</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Purchase</th>
                    <th className="p-2 text-right">Investment</th>
                    <th className="p-2 text-right">Portfolio %</th>
                    <th className="p-2 text-right">CMP</th>
                    <th className="p-2 text-right">Present Value</th>
                    <th className="p-2 text-right">Gain/Loss</th>
                    <th className="p-2 text-right">P/E</th>
                    <th className="p-2 text-right">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {sec.items.map((s, i) => (
                    <tr
                      key={i}
                      className="odd:bg-slate-800 even:bg-slate-900"
                    >
                      <td className="p-2 font-medium text-slate-100">
                        {s.ticker}:{s.exchange}
                      </td>
                      <td className="p-2 text-center">{s.quantity}</td>
                      <td className="p-2 text-right">
                        ₹{s.purchasePrice.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        ₹{s.investment.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        {s.portfolioPercent.toFixed(2)}%
                      </td>
                      <td className="p-2 text-right">
                        {s.cmp != null ? `₹${s.cmp.toFixed(2)}` : "—"}
                      </td>
                      <td className="p-2 text-right">
                        ₹{s.presentValue.toFixed(2)}
                      </td>
                      <td
                        className={`p-2 text-right ${
                          s.gainLoss >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        ₹{s.gainLoss.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        {s.pe != null ? s.pe.toFixed(2) : "—"}
                      </td>
                      <td className="p-2 text-right">
                        {s.latestEarnings != null ? s.latestEarnings.toString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
