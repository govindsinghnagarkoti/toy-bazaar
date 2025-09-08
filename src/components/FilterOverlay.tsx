"use client";

import React from "react";

type FilterOverlayProps = {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  category: string;
  setCategory: (category: string) => void;
  sort: string;
  setSort: (sort: string) => void;
  categories: string[];
};

export default function FilterOverlay({
  setFilterOpen,
  category,
  setCategory,
  sort,
  setSort,
  categories,
}: FilterOverlayProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end"
      onClick={() => setFilterOpen(false)}
    >
      <div
        className="bg-white w-80 max-w-full h-full p-6 overflow-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        <h2 id="filter-title" className="text-2xl font-bold mb-6 text-indigo-700">
          Filters & Sorting
        </h2>

        {/* Category Filter */}
        <div className="mb-6">
          <label htmlFor="category" className="block font-semibold mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="mb-6">
          <label htmlFor="sort" className="block font-semibold mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setFilterOpen(false)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
