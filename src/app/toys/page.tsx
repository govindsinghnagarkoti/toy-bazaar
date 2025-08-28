"use client";
import FilterOverlay from '@/components/FilterOverlay';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const categories = [
  'All',
  'Action Figures',
  'Dolls & Plush Toys',
  'Puzzles & Brain Games',
  'Educational Toys',
  'Building Blocks',
  'Remote Control Toys',
  'Vehicles & Cars',
  'Musical Toys',
  'Role Play & Pretend Play',
  'Outdoor & Sports',
  'Board Games',
  'STEM Toys',
  'Art & Craft',
  'Baby Toys (0-2 yrs)',
  'Electronic Toys',
  'Soft Toys',
  'Wooden Toys',
  'Collectibles & Miniatures',
  'Science & Discovery',
];

export default function ToysListPage() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popularity');
  const [filterOpen, setFilterOpen] = useState(false);

  type Toy = {
    id: string;
    name: string;
    category: string[];
    price: number;
    images: string[]; // 👈 multiple images
  };

  const loadingSkeletons = Array(6).fill(null);
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToys = async () => {
      try {
        const res = await fetch("https://d19ddd36-89f5-4ae6-91c7-12f255dbb711.mock.pstmn.io/toys"); // 👈 API route
        const data = await res.json();
        setToys(data);
      } catch (err) {
        console.error("Failed to fetch toys", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToys();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 font-sans relative">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-30 flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-bold text-pink-600">Furniture Bazaar</h1>
        <button
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-pink-700 transition"
        >
          Filters & Sort
        </button>
      </header>

      {/* Filter Drawer */}
      {filterOpen && (
        <FilterOverlay
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          categories={categories}
        />
      )}

      {/* Toys List */}
     {/* Toys List */}
      <section className="p-4 max-w-md mx-auto">
        {loading ? (
          // Skeleton Loader
          Array(6)
            .fill(null)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md p-4 mb-6 animate-pulse flex flex-col gap-3"
                aria-hidden="true"
              >
                <div className="bg-gray-300 h-40 rounded-lg w-full" />
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-5 bg-gray-300 rounded w-1/3" />
                <div className="h-10 bg-gray-300 rounded-full mt-auto" />
              </div>
            ))
        ) : toys.length === 0 ? (
          <p className="text-center text-gray-600">No toys found.</p>
        ) : (
          toys.map((toy) => (
            <div
              key={toy.id}
              className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col gap-3"
            >
              <Image
                src={toy.images[0]}
                alt={toy.name}
                width={40}
                height={40}
                className="h-40 w-full object-cover rounded-lg"
              />
              <h2 className="text-lg font-semibold">{toy.name}</h2>
              <p className="text-pink-600 font-bold">${toy.price}</p>
              <button className="bg-pink-600 text-white px-4 py-2 rounded-full shadow hover:bg-pink-700 transition">
                Add to Cart
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
