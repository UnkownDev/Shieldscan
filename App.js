import React, { useState } from 'react';

function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!code.trim()) {
      setError("Please enter some code to scan");
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!res.ok) throw new Error("Scan failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Could not reach scanner. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
            🛡️ ShieldScan
          </h1>
          <p className="text-gray-300 mt-4 text-lg">Secure your code before it ships</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your code here...\n\nExample:\nfetch('/api', { headers: { 'Authorization': 'Bearer AKIA123...' } })`}
            className="w-full h-64 p-6 rounded-xl bg-gray-800 text-green-300 border border-gray-700 focus:border-red-500 outline-none font-mono text-sm resize-none"
          />

          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

          <div className="text-center mt-6">
            <button
              onClick={handleScan}
              disabled={loading}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50 px-10 py-4 rounded-xl font-semibold text-lg transition transform hover:scale-105"
            >
              {loading ? '🔍 Scanning...' : '🔍 Scan Code'}
            </button>
          </div>

          {result && (
            <div className="mt-10 bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Scan Results</h2>

              <div className="mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  result.total === 0 ? 'bg-green-900 text-green-200' :
                  result.total < 3 ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'
                }`}>
                  {result.total} Issue(s) Found
                </span>
              </div>

              {result.total === 0 ? (
                <p className="text-green-400">✅ No security issues detected!</p>
              ) : (
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                      <div className="flex justify-between">
                        <strong className="text-red-300">{issue.type}</strong>
                        <span className={`text-xs px-2 py-1 rounded ${
                          issue.severity === 'critical' ? 'bg-red-500 text-white' :
                          issue.severity === 'high' ? 'bg-orange-500 text-white' :
                          'bg-yellow-500 text-black'
                        }`}>
                          {issue.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{issue.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;