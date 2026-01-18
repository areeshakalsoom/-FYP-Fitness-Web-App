import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../utils/api';

const Progress = () => {
  const [weightLogs, setWeightLogs] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeightLogs();
  }, []);

  const fetchWeightLogs = async () => {
    try {
      const response = await api.get('/weight');
      if (response.data.success) {
        setWeightLogs(response.data.data.reverse()); // Chronological order
      }
    } catch (error) {
      console.error('Error fetching weight logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWeight = async (e) => {
    e.preventDefault();
    if (!newWeight) return;

    try {
      const response = await api.post('/weight', { weight: parseFloat(newWeight) });
      if (response.data.success) {
        setNewWeight('');
        fetchWeightLogs();
      }
    } catch (error) {
      console.error('Error logging weight:', error);
    }
  };

  const weightChartData = {
    labels: weightLogs.map(log => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightLogs.map(log => log.weight),
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(244, 63, 94)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  if (loading) {
     return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
           <h1 className="text-5xl font-black text-gray-900 tracking-tight">Your Progress</h1>
           <p className="text-gray-500 mt-4 text-lg">Visualize your transformation and stay motivated.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Weight Logging Card */}
           <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 h-fit">
              <h2 className="text-2xl font-black text-gray-900 mb-8">Log Today's Weight</h2>
              <form onSubmit={handleLogWeight} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-rose-500 focus:bg-white focus:outline-none transition-all text-xl font-bold"
                      placeholder="0.0"
                    />
                 </div>
                 <button
                   type="submit"
                   className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-100 transition-all transform hover:-translate-y-1"
                 >
                   Update Progress
                 </button>
              </form>
              
              <div className="mt-12">
                 <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Milestones</h3>
                 <div className="space-y-4">
                    {weightLogs.length >= 2 && (
                       <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl border border-green-100">
                          <p className="text-sm font-bold text-green-700">Total Change</p>
                          <p className="text-lg font-black text-green-700">
                             {(weightLogs[weightLogs.length-1].weight - weightLogs[0].weight).toFixed(1)} kg
                          </p>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Weight Chart Card */}
           <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-10">Weight Journey</h2>
              {weightLogs.length > 1 ? (
                 <div className="h-[400px]">
                    <Line
                      data={weightChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: '#1e293b',
                            padding: 12,
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 14 },
                            cornerRadius: 12,
                          }
                        },
                        scales: {
                          x: { grid: { display: false } },
                          y: { 
                            beginAtZero: false,
                            grid: { color: '#f1f5f9' },
                            ticks: { font: { weight: 'bold' } }
                          }
                        }
                      }}
                    />
                 </div>
              ) : (
                 <div className="h-[400px] flex flex-col items-center justify-center text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 p-8">
                    <p className="text-4xl mb-4">📈</p>
                    <p className="text-gray-400 font-bold max-w-xs">Log your weight at least twice to see your progress chart!</p>
                 </div>
              )}
           </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
           <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900">Historical Logs</h3>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{weightLogs.length} Entries</span>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-gray-50">
                       <th className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                       <th className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Weight</th>
                       <th className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {[...weightLogs].reverse().map((log, idx, arr) => {
                       const prev = arr[idx+1];
                       const diff = prev ? log.weight - prev.weight : 0;
                       return (
                          <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                             <td className="px-10 py-6 font-bold text-gray-900">
                                {new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                             </td>
                             <td className="px-10 py-6 text-xl font-black text-gray-900">{log.weight} kg</td>
                             <td className="px-10 py-6">
                                {diff !== 0 && (
                                   <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                                      diff < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                   }`}>
                                      {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} kg
                                   </span>
                                )}
                                {diff === 0 && <span className="text-gray-300 font-bold">—</span>}
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
