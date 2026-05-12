import React, { useState, useEffect } from 'react';
import { History, Wallet, Home, Clock, ArrowLeft } from 'lucide-react';
import { API_BASE_URL, APP_VERSION } from '../api/config';

const CalculationHistory = () => {
  const [activeTab, setActiveTab] = useState('salary');
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [mortgageHistory, setMortgageHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(val);

  const formatDate = (dateStr) => 
    new Date(dateStr).toLocaleDateString('he-IL', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const [salRes, mortRes] = await Promise.all([
          fetch(`${API_BASE_URL}/history/salary`),
          fetch(`${API_BASE_URL}/history/mortgage`)
        ]);
        if (salRes.ok) setSalaryHistory(await salRes.json());
        if (mortRes.ok) setMortgageHistory(await mortRes.json());
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
      <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={24} className="text-blue-400" />
          <h2 className="text-xl font-bold">היסטוריית חישובים</h2>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'salary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            שכר
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'mortgage' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            משכנתא
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'salary' ? (
              salaryHistory.length === 0 ? <EmptyState /> : salaryHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-xl"><Wallet size={20} /></div>
                    <div>
                      <div className="font-bold text-slate-800">ברוטו: {formatCurrency(item.gross_salary)}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1"><Clock size={12} /> {formatDate(item.created_at)}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">נטו משוער</div>
                    <div className="text-lg font-black text-blue-700">{formatCurrency(item.net_salary)}</div>
                  </div>
                </div>
              ))
            ) : (
              mortgageHistory.length === 0 ? <EmptyState /> : mortgageHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl"><Home size={20} /></div>
                    <div>
                      <div className="font-bold text-slate-800">הלוואה: {formatCurrency(item.loan_amount)}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1"><Clock size={12} /> {formatDate(item.created_at)}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">החזר חודשי</div>
                    <div className="text-lg font-black text-indigo-700">{formatCurrency(item.monthly_payment)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version {APP_VERSION}</span>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-12 text-slate-400">
    <History size={48} className="mx-auto mb-4 opacity-20" />
    <p className="font-medium">אין חישובים קודמים להצגה</p>
  </div>
);

export default CalculationHistory;