import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState('list');
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ name: '', game: 'CS2', role: '', desc: '' });

  const fetchAds = async () => {
    try {
      const res = await fetch('http://localhost:8000/ads');
      const data = await res.json();
      setAds(data);
    } catch (err) {
      console.log("Бэкенд пока не запущен, используем пустой список");
    }
  };

  useEffect(() => { fetchAds(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.name.length < 3 || form.role.length < 2) {
      alert("Никнейм или роль слишком короткие!");
      return;
    }

    const newAd = { ...form, id: Date.now() };

    await fetch('http://localhost:8000/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAd)
    });

    setView('list');
    fetchAds(); 
    setForm({ name: '', game: 'CS2', role: '', desc: '' });
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 onClick={() => setView('list')} className="logo">LFG</h1>
        <nav className="nav-menu">
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Найти напарников</button>
          <button className={view === 'create' ? 'active' : ''} onClick={() => setView('create')}>Создать пост</button>
        </nav>
      </header>

      <main className="content-area">
        {view === 'list' ? (
          <section className="fade-in">
            <h2 className="section-title">Активные заявки</h2>
            <div className="cards-grid">
              {ads.length > 0 ? ads.map(ad => (
                <div key={ad.id} className="player-card">
                  <span className="game-tag">{ad.game}</span>
                  <h3>{ad.name}</h3>
                  <p><strong>Роль:</strong> {ad.role}</p>
                  <p className="player-desc">{ad.desc}</p>
                  <button className="contact-btn">Откликнуться</button>
                </div>
              )) : <p>Загрузка игроков или список пуст...</p>}
            </div>
          </section>
        ) : (
          <section className="form-section fade-in">
            <h2>Опубликуйте свою заявку</h2>
            <form onSubmit={handleSubmit} className="lfg-form">
              <label>Ваш игровой ник:</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Напр: ProKiller_77" />
              
              <label>Выберите игру:</label>
              <select value={form.game} onChange={e => setForm({...form, game: e.target.value})}>
                <option value="CS2">Counter-Strike 2</option>
                <option value="Dota 2">Dota 2</option>
                <option value="Valorant">Valorant</option>
              </select>

              <label>Ваша роль:</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="Напр: Sniper / Support" />

              <label>О себе / Кого ищете:</label>
              <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} placeholder="Ищу пати для рейтинга..." />
              
              <button type="submit" className="submit-btn">Разместить</button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
