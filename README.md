# check-viagem
teste 
import React, { useEffect, useMemo, useState } from "react";

// --- Sample initial data (small subset). You can expand to full list of countries/cities.
const INITIAL_DATA = [
  {
    id: "europe-spain",
    continent: "Europa",
    country: "Espanha",
    visited: false,
    places: [
      { id: "madrid", name: "Madrid", visited: true },
      { id: "barcelona", name: "Barcelona", visited: false },
      { id: "valverde", name: "Valverde", visited: false }
    ]
  },
  {
    id: "south-america-brazil",
    continent: "América",
    country: "Brasil",
    visited: false,
    places: [
      { id: "sao-paulo", name: "São Paulo", visited: true },
      { id: "rio", name: "Rio de Janeiro", visited: false }
    ]
  },
  {
    id: "asia-japan",
    continent: "Ásia",
    country: "Japão",
    visited: false,
    places: [
      { id: "tokyo", name: "Tóquio", visited: false },
      { id: "kyoto", name: "Kyoto", visited: false }
    ]
  },
  {
    id: "north-america-usa",
    continent: "América",
    country: "Estados Unidos",
    visited: false,
    places: [
      { id: "nyc", name: "Nova York", visited: false },
      { id: "grand-canyon", name: "Grand Canyon", visited: false }
    ]
  },
  {
    id: "oceania-aus",
    continent: "Oceania",
    country: "Austrália",
    visited: false,
    places: [
      { id: "sydney", name: "Sydney", visited: false },
      { id: "uluru", name: "Uluru", visited: false }
    ]
  }
];

const SUGGESTIONS = [
  {
    id: "sugg-paris",
    title: "Paris, França",
    summary: "Capital icônica com a Torre Eiffel, Museus (Louvre), culinária e bairros charmosos.",
    continent: "Europa"
  },
  {
    id: "sugg-machu",
    title: "Machu Picchu, Peru",
    summary: "Antiga cidade inca famosa por sua localização nas montanhas e valor histórico.",
    continent: "América"
  },
  {
    id: "sugg-grand-canyon",
    title: "Grand Canyon, EUA",
    summary: "Formação geológica impressionante com trilhas e mirantes espetaculares.",
    continent: "América"
  }
];

const CONTINENTS = ["Todos", "África", "América", "Ásia", "Europa", "Oceania"];

const STORAGE_KEYS = {
  DATA: "travel_checklist_data_v1",
  WANT: "travel_checklist_want_v1"
};

// Helper to generate simple ids
const makeId = (prefix = "id") => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export default function App() {
  const [tab, setTab] = useState("conheco"); // conheco | quero | sugestoes
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DATA);
      return raw ? JSON.parse(raw) : INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  });

  const [wantList, setWantList] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.WANT);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [continentFilter, setContinentFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  // persist data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WANT, JSON.stringify(wantList));
  }, [wantList]);

  // Counters: count visited countries + visited places
  const counters = useMemo(() => {
    let countriesVisited = 0;
    let placesVisited = 0;
    data.forEach((c) => {
      if (c.visited) countriesVisited += 1;
      c.places.forEach((p) => {
        if (p.visited) placesVisited += 1;
      });
    });
    return { countriesVisited, placesVisited, totalVisited: countriesVisited + placesVisited };
  }, [data]);

  // Handlers
  const toggleCountryVisited = (countryId) => {
    setData((prev) =>
      prev.map((c) => {
        if (c.id !== countryId) return c;
        // toggling country visited: if setting to true, mark all places visited true
        const newVisited = !c.visited;
        return {
          ...c,
          visited: newVisited,
          places: c.places.map((p) => ({ ...p, visited: newVisited }))
        };
      })
    );
  };

  const togglePlaceVisited = (countryId, placeId) => {
    setData((prev) =>
      prev.map((c) => {
        if (c.id !== countryId) return c;
        const newPlaces = c.places.map((p) => (p.id === placeId ? { ...p, visited: !p.visited } : p));
        // if all places visited, optionally mark country visited
        const allPlacesVisited = newPlaces.every((p) => p.visited);
        return { ...c, places: newPlaces, visited: allPlacesVisited };
      })
    );
  };

  const addPlaceToCountry = (countryId, placeName) => {
    if (!placeName.trim()) return;
    setData((prev) =>
      prev.map((c) => (c.id === countryId ? { ...c, places: [...c.places, { id: makeId("place"), name: placeName, visited: false }] } : c))
    );
  };

  const addCountry = (countryName, continent, initialPlaces = []) => {
    if (!countryName.trim()) return;
    const country = {
      id: makeId("country"),
      continent: continent || "",
      country: countryName,
      visited: false,
      places: initialPlaces.map((p) => ({ id: makeId("place"), name: p, visited: false }))
    };
    setData((prev) => [country, ...prev]);
  };

  // Want list handlers
  const addToWant = (title, notes = "") => {
    if (!title.trim()) return;
    const item = { id: makeId("want"), title, notes };
    setWantList((prev) => [item, ...prev]);
  };

  const removeWant = (id) => setWantList((prev) => prev.filter((w) => w.id !== id));

  // add suggestion to want list
  const addSuggestionToWant = (suggestion) => addToWant(suggestion.title, suggestion.summary);

  // filter data by continent
  const visibleData = useMemo(() => {
    return data
      .filter((c) => (continentFilter === "Todos" ? true : c.continent === continentFilter))
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        if (c.country.toLowerCase().includes(q)) return true;
        if (c.places.some((p) => p.name.toLowerCase().includes(q))) return true;
        return false;
      });
  }, [data, continentFilter, search]);

  // UI components in-file for clarity
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-semibold">Travel Checklist</h1>
          <div className="space-x-2">
            <button
              className={`px-3 py-1 rounded ${tab === "conheco" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTab("conheco")}
            >
              Já Conheço
            </button>
            <button
              className={`px-3 py-1 rounded ${tab === "quero" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTab("quero")}
            >
              Quero Conhecer
            </button>
            <button
              className={`px-3 py-1 rounded ${tab === "sugestoes" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
              onClick={() => setTab("sugestoes")}
            >
              Sugestões
            </button>
          </div>
        </header>

        <main className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left column: controls */}
          <aside className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-medium">Controles</h2>
            <div className="mt-3">
              <label className="block text-sm">Filtrar por continente</label>
              <select
                value={continentFilter}
                onChange={(e) => setContinentFilter(e.target.value)}
                className="w-full mt-2 p-2 rounded border"
              >
                {CONTINENTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm">Buscar</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="país, cidade..."
                className="w-full mt-2 p-2 rounded border"
              />
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Resumo</h3>
              <p className="text-sm mt-2">Países visitados: {counters.countriesVisited}</p>
              <p className="text-sm">Lugares visitados: {counters.placesVisited}</p>
              <p className="text-sm font-medium mt-2">Total visitados: {counters.totalVisited}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Quer adicionar um país?</h3>
              <QuickAddForm onAdd={(name, continent, placesCsv) => {
                const places = placesCsv ? placesCsv.split(",").map(s => s.trim()).filter(Boolean) : [];
                addCountry(name, continent, places);
              }} />
            </div>
          </aside>

          {/* Main column */}
          <section className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            {tab === "conheco" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Já Conheço</h2>
                <p className="text-sm text-gray-600 mb-3">Marque países ou lugares que você já visitou.</p>

                <div className="space-y-3">
                  {visibleData.length === 0 && <p className="text-sm text-gray-500">Nenhum país encontrado.</p>}
                  {visibleData.map((country) => (
                    <div key={country.id} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={country.visited}
                            onChange={() => toggleCountryVisited(country.id)}
                          />
                          <div>
                            <div className="font-medium">{country.country}</div>
                            <div className="text-xs text-gray-500">{country.continent}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{country.places.length} lugares</div>
                      </div>

                      <div className="mt-3 border-t pt-3">
                        {country.places.map((p) => (
                          <div key={p.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={p.visited}
                                onChange={() => togglePlaceVisited(country.id, p.id)}
                              />
                              <div>{p.name}</div>
                            </div>
                            <div className="text-xs text-gray-400">{p.visited ? "Visitado" : "Não visitado"}</div>
                          </div>
                        ))}

                        <div className="mt-3">
                          <AddPlaceInline onAdd={(placeName) => addPlaceToCountry(country.id, placeName)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "quero" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Quero Conhecer</h2>
                <p className="text-sm text-gray-600 mb-3">Adicione países ou lugares que você sonha em visitar.</p>

                <WantList
                  items={wantList}
                  onRemove={removeWant}
                  onAddToKnown={(title) => {
                    // quick conversion: add as a country without places when user wants to mark known
                    addToWant(title);
                  }}
                />

                <div className="mt-4">
                  <AddWantForm onAdd={(title, notes) => addToWant(title, notes)} />
                </div>
              </div>
            )}

            {tab === "sugestoes" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Sugestões</h2>
                <p className="text-sm text-gray-600 mb-3">Lugares recomendados pelo app</p>

                <div className="space-y-3">
                  {SUGGESTIONS.map((s) => (
                    <div key={s.id} className="border rounded p-3 flex items-start justify-between">
                      <div>
                        <div className="font-medium">{s.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{s.summary}</div>
                        <div className="text-xs text-gray-400 mt-1">{s.continent}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button className="px-3 py-1 rounded bg-indigo-600 text-white text-sm" onClick={() => addSuggestionToWant(s)}>
                          Adicionar
                        </button>
                        <button className="px-3 py-1 rounded bg-gray-100 text-sm" onClick={() => alert(s.summary)}>
                          Ver resumo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right column: quick stats / list (mobile moves under main) */}
          <aside className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold">Resumo rápido</h3>
            <div className="mt-2 text-sm">
              <div>Países visitados: {counters.countriesVisited}</div>
              <div>Lugares visitados: {counters.placesVisited}</div>
              <div className="font-medium mt-2">Total: {counters.totalVisited}</div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Lista Quero Conhecer ({wantList.length})</h4>
              <div className="mt-2 space-y-2 max-h-40 overflow-auto">
                {wantList.length === 0 && <div className="text-sm text-gray-500">Nenhum item</div>}
                {wantList.map((w) => (
                  <div key={w.id} className="flex items-center justify-between bg-white p-2 rounded">
                    <div>
                      <div className="text-sm font-medium">{w.title}</div>
                      {w.notes && <div className="text-xs text-gray-500">{w.notes}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-xs text-indigo-600" onClick={() => addToWant(w.title, w.notes)}>
                        Copiar
                      </button>
                      <button className="text-xs text-red-500" onClick={() => removeWant(w.id)}>
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        <footer className="p-4 text-xs text-gray-500 border-t text-center">Feito com ❤️ — Travel Checklist</footer>
      </div>
    </div>
  );
}


// ------------------ Small subcomponents ------------------
function QuickAddForm({ onAdd }) {
  const [name, setName] = useState("");
  const [continent, setContinent] = useState("Europa");
  const [placesCsv, setPlacesCsv] = useState("");
  return (
    <div className="mt-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do país" className="w-full p-2 rounded border text-sm" />
      <select value={continent} onChange={(e) => setContinent(e.target.value)} className="w-full mt-2 p-2 rounded border text-sm">
        {CONTINENTS.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input value={placesCsv} onChange={(e) => setPlacesCsv(e.target.value)} placeholder="Cidades separadas por vírgula" className="w-full mt-2 p-2 rounded border text-sm" />
      <button
        className="mt-2 w-full px-3 py-2 rounded bg-green-600 text-white text-sm"
        onClick={() => {
          onAdd(name, continent, placesCsv);
          setName("");
          setPlacesCsv("");
        }}
      >
        Adicionar país
      </button>
    </div>
  );
}

function AddPlaceInline({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  if (!open)
    return (
      <button className="text-sm text-indigo-600" onClick={() => setOpen(true)}>
        + Adicionar lugar
      </button>
    );
  return (
    <div className="flex gap-2">
      <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Nome do lugar" className="flex-1 p-2 border rounded" />
      <button
        className="px-3 py-1 bg-indigo-600 text-white rounded"
        onClick={() => {
          onAdd(value);
          setValue("");
          setOpen(false);
        }}
      >
        OK
      </button>
    </div>
  );
}

function WantList({ items, onRemove }) {
  return (
    <div className="space-y-2">
      {items.length === 0 && <div className="text-sm text-gray-500">Nenhum item na lista.</div>}
      {items.map((it) => (
        <div key={it.id} className="border rounded p-2 flex items-start justify-between">
          <div>
            <div className="font-medium">{it.title}</div>
            {it.notes && <div className="text-xs text-gray-500">{it.notes}</div>}
          </div>
          <div className="flex flex-col gap-1">
            <button className="text-xs text-indigo-600" onClick={() => alert(`Adicionar '${it.title}' à lista de conhecidos (não implementado)`)}>
              Marcar como conhecido
            </button>
            <button className="text-xs text-red-500" onClick={() => onRemove(it.id)}>
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddWantForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <div className="mt-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome do lugar / país" className="w-full p-2 rounded border text-sm" />
      <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas / porquê" className="w-full mt-2 p-2 rounded border text-sm" />
      <button
        className="mt-2 px-3 py-2 rounded bg-indigo-600 text-white text-sm"
        onClick={() => {
          onAdd(title, notes);
          setTitle("");
          setNotes("");
        }}
      >
        Adicionar à lista
      </button>
    </div>
  );
}
