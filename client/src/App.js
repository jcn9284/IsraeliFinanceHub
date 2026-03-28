import React, { useState } from 'react';
import { Calculator, Home } from 'lucide-react';
import SalaryCalculator from './components/SalaryCalculator';
import MortgageCalculator from './components/MortgageCalculator';

const App = () => {
  const [activeTab, setActiveTab] = useState('salary');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-10">
      <header className="mb-10 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">מחשבון פיננסי ישראלי</h1>
        <p className="text-slate-500 text-lg">כלים חכמים לניהול השכר והמשכנתא שלך</p>
      </header>

      <div className="w-full max-w-4xl">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 bg-white p-1 rounded-2xl shadow-sm border border-slate-200 w-fit mx-auto">
          <button
            onClick={() => setActiveTab('salary')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'salary'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calculator size={20} />
            <span className="font-bold">מחשבון שכר</span>
          </button>
          <button
            onClick={() => setActiveTab('mortgage')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
              activeTab === 'mortgage'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Home size={20} />
            <span className="font-bold">מחשבון משכנתא</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in">
          {activeTab === 'salary' ? (
            <div className="p-4 md:p-8 bg-white rounded-3xl shadow-xl border border-slate-100 min-h-[400px]">
               <SalaryCalculator />
            </div>
          ) : (
            <div className="p-4 md:p-8 bg-white rounded-3xl shadow-xl border border-slate-100 min-h-[400px]">
               <MortgageCalculator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;