import React, { useState } from 'react';
import { 
  Laptop2, 
  Database, 
  Zap, 
  Server, 
  Activity, 
  RotateCw, 
  Trash2, 
  Terminal, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  CheckCircle2, 
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeveloperDashboard: React.FC = () => {
  const { 
    devMetrics, 
    refreshDevMetrics, 
    clearCache, 
    optimizeDatabase, 
    auditLogs 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'metrics' | 'queries' | 'logs'>('metrics');
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  const uptimeDays = (devMetrics.uptimeSeconds / 86400).toFixed(1);

  const handleSimulateLoad = () => {
    setIsSimulatingLoad(true);
    setTimeout(() => {
      refreshDevMetrics();
      setIsSimulatingLoad(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Laptop2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                Backend Infrastructure & Database Monitor
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PROD-CLUSTER-ASIA-01
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Pemeliharaan teknis infrastruktur backend, optimasi query basis data, metrik latency, dan status node cache.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshDevMetrics}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh Metrik</span>
          </button>
        </div>
      </div>

      {/* Real-time Health Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Server SLA */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>Status Server Gateway</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{devMetrics.serverStatus}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Uptime: {uptimeDays} hari non-stop</p>
        </div>

        {/* Database Query Latency */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>Query Latency p95</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {devMetrics.queryLatencyMs} ms
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Indeks B-Tree Aktif & Terpelihara
          </p>
        </div>

        {/* Redis Cache Hit Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>Cache Hit Rate (Redis)</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {devMetrics.redisCacheHitRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1">High throughput kost listings</p>
        </div>

        {/* CPU & Memory */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>CPU / RAM Usage</span>
            <Cpu className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {devMetrics.cpuUsagePercent}% / {devMetrics.memoryUsagePercent}%
          </div>
          <p className="text-xs text-slate-500 mt-1">{devMetrics.requestsPerMinute} req/min</p>
        </div>

      </div>

      {/* Operational Maintenance Action Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Tindakan Pemeliharaan Infrastruktur & Database
        </h3>
        <p className="text-xs text-slate-500">
          Jalankan perintah optimasi backend langsung untuk meningkatkan performa kueri dan membersihkan memori.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={optimizeDatabase}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">PostgreSQL</span>
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">
              Run VACUUM & REINDEX
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Rekonstruksi indeks pencarian lokasi kos dan optimize kueri mahasiswa
            </p>
          </button>

          <button
            onClick={clearCache}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Trash2 className="w-5 h-5 text-amber-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Redis</span>
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">
              Flush In-Memory Cache
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Bersihkan stale cache listing kos dan reload state ketersediaan kamar
            </p>
          </button>

          <button
            disabled={isSimulatingLoad}
            onClick={handleSimulateLoad}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Load Test</span>
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600">
              Simulasi Lonjakan Trafik Mahasiswa
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Uji ketahanan konkurensi saat musim penerimaan mahasiswa baru (SNBP/SNBT)
            </p>
          </button>
        </div>
      </div>

      {/* SQL Query Optimization Breakdown */}
      <div className="bg-slate-950 text-slate-300 rounded-3xl p-6 font-mono text-xs border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-bold">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Database Query Execution Plan (EXPLAIN ANALYZE)</span>
          </div>
          <span className="text-[11px] text-emerald-400">Indexed Scan: 0.042ms</span>
        </div>

        <pre className="text-slate-400 overflow-x-auto p-2 bg-slate-900 rounded-xl leading-relaxed">
{`SELECT k.id, k.name, k.price_per_month, count(r.id) AS available_rooms 
FROM kost_listings k
JOIN rooms r ON r.kost_id = k.id AND r.is_available = TRUE
WHERE k.campus_key = 'UI' AND k.price_per_month <= 2000000
GROUP BY k.id, k.name, k.price_per_month
ORDER BY k.rating DESC LIMIT 20;

-> Index Scan using idx_kost_campus_price on kost_listings k (cost=0.15..8.25 rows=6)
-> HashAggregate  (cost=12.40..14.50 rows=6)
-> Execution Time: 0.812 ms (Optimized with GIN index)`}
        </pre>
      </div>

    </div>
  );
};
