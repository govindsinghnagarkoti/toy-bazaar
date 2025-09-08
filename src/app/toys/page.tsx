"use client";
import FilterOverlay from '@/components/FilterOverlay';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toy } from "@/types/toy";
import Link from 'next/link';
import { Suspense } from 'react';

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

// Extract the component that uses useSearchParams into a separate component
function ToysContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popularity');
  const [filterOpen, setFilterOpen] = useState(false);

  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Sync state from URL on mount and param changes
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    const urlSort = searchParams.get('sort') || 'popularity';
    setCategory(urlCategory);
    setSort(urlSort);
  }, [searchParams]);

  useEffect(() => {
    const fetchToys = async () => {
      try {
        setLoading(true);
        const qs = new URLSearchParams();
        if (category && category !== 'All') qs.set('category', category);
        if (sort) qs.set('sort', sort);
        const res = await fetch(`/api/toys?${qs.toString()}`, { next: { revalidate: 60 } });
        if (!res.ok) {
          console.error("/api/toys failed", res.status, res.statusText);
          setToys([]);
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setToys(list);
      } catch (err) {
        console.error("Failed to fetch toys", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToys();
  }, [category, sort]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-30 flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-bold text-indigo-700">Furniture Bazaar</h1>
        <button
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
        >
          Filters & Sort
        </button>
      </header>

      {/* Filter Drawer */}
      {filterOpen && (
        <FilterOverlay
          filterOpen={filterOpen}
          setFilterOpen={(open) => {
            if (!open) {
              const qs = new URLSearchParams();
              if (category && category !== 'All') qs.set('category', category);
              if (sort) qs.set('sort', sort);
              router.replace(`/toys?${qs.toString()}`);
            }
            setFilterOpen(open);
          }}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          categories={categories}
        />
      )}

      {/* Toys List */}
      <section className="p-4 mx-auto max-w-2xl sm:max-w-3xl">
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
          <div className="grid gap-4 sm:grid-cols-2">
          {toys.filter(toy => toy.stock !== "0").map((toy) => (
            <div key={toy.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col hover:shadow-md transition border border-gray-100">
              <Link
                href={`/toys/${toy.id}`}
                className="block"
              >
              {/* Image container */}
              <div className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden">
                <Image
                  src={
                    toy.images && toy.images.length > 0
                      ? toy.images[0]
                      : "/placeholder.png"
                  }
                  alt={toy.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text & Button */}
              <h2 className="mt-3 text-base font-semibold leading-snug text-slate-900">{toy.name}</h2>
              {Array.isArray(toy.category) && toy.category.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {toy.category.slice(0, 3).map((cat) => (
                    <span key={cat} className="inline-block text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                      {cat}
                    </span>
                  ))}
                  {toy.category.length > 3 && (
                    <span className="inline-block text-xs px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                      +{toy.category.length - 3} more
                    </span>
                  )}
                </div>
              )}
              </Link>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-amber-600 font-extrabold text-lg">₹{toy.price}</p>
                <Link
                  href={`/toys/${toy.id}`}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition"
                >
                  <span>View</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M4.5 12a.75.75 0 01.75-.75h11.69l-3.72-3.72a.75.75 0 111.06-1.06l5 5a.75.75 0 010 1.06l-5 5a.75.75 0 11-1.06-1.06l3.72-3.72H5.25A.75.75 0 014.5 12z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}
      </section>
    </>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <main className="min-h-screen bg-gray-100 font-sans relative">
      <header className="sticky top-0 bg-white shadow-md z-30 flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-bold text-indigo-700">Furniture Bazaar</h1>
        <div className="bg-gray-200 animate-pulse px-4 py-2 rounded-lg">
          <div className="w-24 h-6 bg-gray-300 rounded"></div>
        </div>
      </header>
      <section className="p-4 mx-auto max-w-2xl sm:max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array(6).fill(null).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 mb-6 animate-pulse flex flex-col gap-3"
            >
              <div className="bg-gray-300 h-40 rounded-lg w-full" />
              <div className="h-6 bg-gray-300 rounded w-3/4" />
              <div className="h-5 bg-gray-300 rounded w-1/3" />
              <div className="h-10 bg-gray-300 rounded-full mt-auto" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function ToysListPage() {
  return (
    <main className="min-h-screen bg-gray-100 font-sans relative">
      <Suspense fallback={<LoadingFallback />}>
        <ToysContent />
      </Suspense>
    </main>
  );
}

// LikeOnce removed from listing per request