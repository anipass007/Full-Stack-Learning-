import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import NotFound from './pages/NotFound';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/recipe/:id" element={<RecipeDetail/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>

    </div>
  );
}

export default App;