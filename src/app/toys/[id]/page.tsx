// src/app/toys/[id]/page.tsx
"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Toy = {
  id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
};

export default function ToyDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [toy, setToy] = useState<Toy | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const contactPhone = (process.env.NEXT_PUBLIC_CONTACT_PHONE as string) || "YOUR_PHONE_NUMBER";
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const fetchToy = async () => {
      try {
        const res = await fetch(`/api/toys/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch toy");
        const data = await res.json();
        setToy(data);
      } catch (err) {
        console.error("Failed to fetch toy", err);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) fetchToy();
  }, [params]);

  // Close modal on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    if (modalOpen) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  // Persist like per user using localStorage
  useEffect(() => {
    if (!toy?.id) return;
    try {
      const flag = typeof window !== "undefined" ? window.localStorage.getItem(`liked:${toy.id}`) : null;
      if (flag === "1") setLiked(true);
    } catch {}
  }, [toy?.id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!toy) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">Toy not found</h2>
        <Link href="/toys" className="text-blue-600 underline">
          Back to Toys
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-amber-50 to-indigo-50 p-2 sm:p-6">
      <Link
        href="/toys"
        className="inline-block mb-2 sm:mb-4 text-pink-600 font-semibold hover:underline text-base sm:text-lg"
      >
        ← Back to Toys
      </Link>
    
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-2 sm:p-6 max-w-full sm:max-w-3xl mx-auto border border-pink-100">
        <div
          className="relative w-full h-56 sm:h-72 mb-2 sm:mb-4 cursor-zoom-in rounded-xl border-2 border-indigo-100 shadow-md"
          onClick={() => {
            const img = toy.images?.[0] ?? "/placeholder.png";
            setActiveImage(img);
            setModalOpen(true);
          }}
        >
          <Image
            src={toy.images?.[0] ?? "/placeholder.png"}
            alt={toy.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover rounded-xl"
          />
        </div>
    
        <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-900 drop-shadow mb-1 sm:mb-2">{toy.name}</h1>
        <p className="text-amber-600 font-bold text-xl sm:text-2xl mt-1 sm:mt-2">₹{toy.price}</p>
        <p className="text-gray-700 mt-2 sm:mt-4 text-base sm:text-lg leading-relaxed">{toy.description}</p>

        {(() => {
          const secretParam = searchParams.get("secret");
          const secretEnv = process.env.NEXT_PUBLIC_EDIT_SECRET as string | undefined;
          const canEdit = Boolean(secretParam && secretEnv && secretParam === secretEnv);
          if (!canEdit) return null;
          return (
            <div className="mt-4">
              <Link
                href={`/toys/${toy.id}/edit`}
                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow"
              >
                ✏️ Edit
              </Link>
            </div>
          );
        })()}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {toy.images?.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className="relative w-full h-32 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => {
                setActiveImage(img);
                setModalOpen(true);
              }}
              aria-label={`Open image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${toy.name} ${idx}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 256px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 min-h-10">
          {!liked ? (
            <button
              disabled={liking}
              onClick={async () => {
                if (!toy || liking) return;
                setLiking(true);
                try {
                  await fetch(`/api/toys/${toy.id}`, { method: "POST" });
                } catch {}
                setLiked(true);
                setShowCelebration(true);
                try {
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(`liked:${toy.id}`, "1");
                  }
                } catch {}
                setTimeout(() => {
                  setLiking(false);
                  setShowCelebration(false);
                }, 1200);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow transition bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
              aria-label="Like this toy"
            >
              <span>❤️</span>
              <span>Like</span>
            </button>
          ) : showCelebration ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold bg-indigo-600 text-white shadow">
              <span className="animate-pulse">🎉</span>
              <span>Thanks for the like!</span>
              <span className="animate-pulse">✨</span>
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-bold shadow-lg transition text-lg sm:text-xl"
            onClick={() => {
              if (!toy) return;
              const digits = contactPhone.replace(/\D/g, "");
              const pageUrl = typeof window !== "undefined" ? window.location.href : "";
              const message = `Hello! I'm interested in \"${toy.name}\" priced at ₹${toy.price}. Link: ${pageUrl}`;
              const wa = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
              window.open(wa, "_blank", "noopener,noreferrer");
            }}
            aria-label="Contact on WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 13.487a7.5 7.5 0 1 0-3.375 3.375l2.25.75a.75.75 0 0 0 .938-.938l-.75-2.25z" />
            </svg>
            WhatsApp
          </button>
          <a
            href="https://www.instagram.com/toybazaar1608/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-bold py-3 rounded-full shadow-lg transition text-lg sm:text-xl"
            aria-label="Follow on Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
              <circle cx="12" cy="12" r="5" fill="#fff" />
              <circle cx="17" cy="7" r="1.5" fill="#fff" />
            </svg>
            Instagram
          </a>
        </div>
      </div>

      {modalOpen && activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-8"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onKeyDown={e => { if (e.key === "Escape") setModalOpen(false); }}
        >
          <div
            className="relative w-full max-w-md sm:max-w-2xl bg-white rounded-xl shadow-lg p-2 sm:p-6 flex flex-col items-center"
            onClick={e => { e.stopPropagation(); }}
          >
            <button
              type="button"
              aria-label="Close image"
              className="absolute top-2 right-2 text-gray-700 bg-white rounded-full p-2 shadow-md text-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              onClick={e => { e.stopPropagation(); setModalOpen(false); }}
              onTouchStart={e => { e.stopPropagation(); setModalOpen(false); }}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " " || e.key === "Escape") { setModalOpen(false); } }}
              tabIndex={0}
            >
              ×
            </button>
            <div className="relative w-full h-80 sm:h-[32rem] flex items-center justify-center">
              <Image
                src={activeImage}
                alt="Preview"
                fill
                priority
                sizes="100vw"
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



