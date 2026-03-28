import React, { useState } from 'react';
import { Home, Percent, Calendar, Calculator } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const MortgageCalculator = () => {
  const [inputs, setInputs] = useState({
    loan_amount: '',
    interest_rate: '',
    years: '30',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => 
    new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(value);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/mortgage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loan_amount: parseFloat(inputs.loan_amount),
          interest_rate: parseFloat(inputs.interest_rate),
          years: parseInt(inputs.years),
        }),
      });

      if (!response.ok) throw new Error('שגיאה בחישוב המשכנתא. וודא שהשרת פועל.');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              סכום ההלוואה (₪)
            </label>
            <div className="relative">
              <input
                type="number"
                value={inputs.loan_amount}
                onChange={(e) => setInputs({ ...inputs, loan_amount: e.target.value })}
                placeholder="לדוגמה: 1000000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium"
                required
              />
              <Home className="absolute left-4 top-3.5 text-slate-400" size={20} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              ריבית שנתית (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={inputs.interest_rate}
                onChange={(e) => setInputs({ ...inputs, interest_rate: e.target.value })}
                placeholder="4.5"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium"
                required
              />
              <Percent className="absolute left-4 top-3.5 text-slate-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              תקופה (שנים)
            </label>
            <div className="relative">
              <input
                type="number"
                value={inputs.years}
                onChange={(e) => setInputs({ ...inputs, years: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium"
                required
              />
              <Calendar className="absolute left-4 top-3.5 text-slate-400" size={20} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Calculator size={20} /><span>חשב החזר חודשי</span></>}
        </button>
      </form>

      {error && <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center font-medium">{error}</div>}

      {result && (
        <div className="mt-10 space-y-4 animate-fade-in">
          <div className="text-center p-8 bg-blue-50 rounded-3xl border border-blue-100 shadow-sm">
            <h3 className="text-slate-600 font-medium mb-2 text-lg">החזר חודשי משוער</h3>
            <div className="text-5xl font-black text-blue-700">{formatCurrency(result.monthly_payment)}</div>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
            <span className="text-slate-500 font-medium text-lg">סה"כ החזר (קרן + ריבית):</span>
            <span className="text-slate-900 font-bold text-xl">{formatCurrency(result.total_payment)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MortgageCalculator;