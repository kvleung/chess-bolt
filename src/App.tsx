import React from 'react';
import Chessboard from './components/Chessboard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-amber-900">React Chess</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto">
        <Chessboard />
      </main>
    </div>
  );
}

export default App;