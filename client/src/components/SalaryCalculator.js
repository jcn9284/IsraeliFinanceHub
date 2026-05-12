import React, { useState } from 'react';
import { Coins, Calculator, Info, User, Users, ShieldCheck, GraduationCap, Building } from 'lucide-react';
import { API_BASE_URL, APP_VERSION } from '../api/config';

const SalaryCalculator = () => {
  const [gross, setGross] = useState('');
  const [childAges, setChildAges] = useState([]);
  const [isWoman, setIsWoman] = useState(false);
  const [includePension, setIncludePension] = useState(true);
  const [hasStudyFund, setHasStudyFund] = useState(false);
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
      const response = await fetch(`${API_BASE_URL}/salary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gross_salary: parseFloat(gross),
          child_ages: childAges,
          is_woman: isWoman,
          include_pension: includePension,
          has_study_fund: hasStudyFund,
        }),
      });

      if (!response.ok) throw new Error('שגיאה בחישוב השכר. וודא שהשרת פועל.');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChildrenCountChange = (e) => {
    const count = Math.max(0, parseInt(e.target.value) || 0);
    if (count > childAges.length) {
      setChildAges([...childAges, ...Array(count - childAges.length).fill(0)]);
    } else {
      setChildAges(childAges.slice(0, count));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              שכר ברוטו חודשי (₪)
            </label>
            <div className="relative">
              <input
                type="number"
                value={gross}
                onChange={(e) => setGross(e.target.value)}
                placeholder="לדוגמה: 15000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium"
                required
              />
              <Coins className="absolute left-4 top-3.5 text-slate-400" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              מספר ילדים
            </label>
            <div className="relative">
              <input
                type="number"
                value={childAges.length}
                onChange={handleChildrenCountChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg font-medium"
                required
              />
              <Users className="absolute left-4 top-3.5 text-slate-400" size={20} />
            </div>
          </div>
        </div>

        {childAges.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
            {childAges.map((age, index) => (
              <div key={index}>
                <label className="block text-xs font-bold text-slate-500 mb-1">גיל ילד {index + 1}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => {
                    const newAges = [...childAges];
                    newAges[index] = Math.max(0, parseInt(e.target.value) || 0);
                    setChildAges(newAges);
                  }}
                  className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <User className="text-slate-400" size={20} />
          <span className="text-sm font-semibold text-slate-700">מין:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsWoman(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${!isWoman ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              גבר
            </button>
            <button
              type="button"
              onClick={() => setIsWoman(true)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${isWoman ? 'bg-pink-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'}`}
            >
              אישה
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setIncludePension(!includePension)}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${includePension ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <div className="text-right">
                <div className="text-sm font-bold">הפרשה לפנסיה (6%)</div>
                <div className="text-[10px] opacity-70">חובה על פי חוק</div>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${includePension ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${includePension ? 'right-6' : 'right-1'}`} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setHasStudyFund(!hasStudyFund)}
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${hasStudyFund ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={20} />
              <div className="text-right">
                <div className="text-sm font-bold">קרן השתלמות (2.5%)</div>
                <div className="text-[10px] opacity-70">הטבת מעסיק נפוצה</div>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${hasStudyFund ? 'bg-indigo-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${hasStudyFund ? 'right-6' : 'right-1'}`} />
            </div>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Calculator size={20} />
              <span>חשב נטו</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-4 animate-fade-in">
          <div className="text-center p-8 bg-blue-50 rounded-3xl border border-blue-100 shadow-sm">
            <h3 className="text-slate-600 font-medium mb-2 text-lg">שכר נטו משוער</h3>
            <div className="text-5xl font-black text-blue-700">
              {formatCurrency(result.net_salary)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
              <span className="text-slate-500 font-medium">נקודות זיכוי:</span>
              <span className="text-blue-600 font-bold text-lg">{result.points}</span>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
              <span className="text-slate-500 font-medium">עלות מעסיק כוללת:</span>
              <span className="text-emerald-600 font-bold text-lg flex items-center gap-1">
                <Building size={16} /> {formatCurrency(result.employer_cost)}
              </span>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
              <span className="text-slate-500 font-medium">מס הכנסה:</span>
              <span className="text-red-500 font-bold text-lg">{formatCurrency(result.tax)}</span>
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
              <span className="text-slate-500 font-medium text-sm md:text-base">ביטוח לאומי ובריאות:</span>
              <span className="text-red-500 font-bold text-lg">{formatCurrency(result.social_security)}</span>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 text-center">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Version {APP_VERSION}</span>
      </div>
    </div>
  );
};

export default SalaryCalculator;