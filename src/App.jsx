import React, { useState, useEffect } from 'react';

const App = () => {
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [wantToVisit, setWantToVisit] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterContinent, setFilterContinent] = useState('');

  useEffect(() => {
    const storedVisited = localStorage.getItem('visitedCountries');
    const storedWantToVisit = localStorage.getItem('wantToVisit');
    if (storedVisited) setVisitedCountries(JSON.parse(storedVisited));
    if (storedWantToVisit) setWantToVisit(JSON.parse(storedWantToVisit));
  }, []);

  useEffect(() => {
    localStorage.setItem('visitedCountries', JSON.stringify(visitedCountries));
  }, [visitedCountries]);

  useEffect(() => {
    localStorage.setItem('wantToVisit', JSON.stringify(wantToVisit));
  }, [wantToVisit]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered countries logic here
  const filteredVisited = visitedCountries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterContinent ? country.continent === filterContinent : true)
  );

  return (
    <div>
      <h1>Country Manager</h1>
      <input
        type="text"
        placeholder="Search countries"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div>
        <h2>Visited Countries</h2>
        <ul>
          {filteredVisited.map(country => <li key={country}>{country}</li>) }
        </ul>
      </div>
      <div>
        <h2>Want to Visit</h2>
        <ul>
          {wantToVisit.map(country => <li key={country}>{country}</li>) }
        </ul>
      </div>
    </div>
  );
};

export default App;