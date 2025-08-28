"use client";  // Mark this component as a Client Component

import Image from 'next/image';
import { useRouter } from 'next/router';

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
 {/* Back Button */}
 <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 bg-white bg-opacity-90 hover:bg-opacity-100 transition rounded-full p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        aria-label="Go back"
      >
        {/* Simple left arrow icon (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-pink-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Hero Section */}
      <section className="relative h-[450px] w-full overflow-hidden">
        <Image
          src="/images/about.jpg"
          alt="Kids playing with toys background"
          fill
          className="object-cover brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 sm:px-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
            About Toy Bazaar
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-pink-200 drop-shadow-md max-w-xl font-medium">
            Bringing joy, learning, and imagination to every child.
          </p>
        </div>
      </section>

      {/* Our Story Card */}
      <section className="max-w-md sm:max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10 -mt-16 relative z-10 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-4">Visit Us</h2>
        <p className="text-lg font-semibold mb-1">Toy Bazaar</p>
        <p className="text-gray-700 mb-1">
          79 4th floor, RPS Palm Drive, Sector 88, Gopal Vatika Road, Faridabad
        </p>
        <p className="text-gray-600 mb-4">Open Daily: 10 AM - 9 PM</p>
        <a
          href="https://wa.me/919871171608?text=Hi%20Toy%20Bazaar%2C%20I'm%20interested%20in%20your%20toys.%20Can%20you%20help%20me%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 text-white px-8 py-3 rounded-full text-lg font-semibold shadow transition"
        >
          💬 Chat with us on WhatsApp
        </a>
      </section>

    
      {/* Instagram Card */}
      <section className="max-w-md sm:max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10 mb-10">
  <h2 className="text-3xl font-extrabold text-pink-700 mb-5 text-center">📸 Were on Instagram!</h2>
  
  <div className="flex justify-center mb-6">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/120px-Instagram_logo_2016.svg.png"
        alt="Instagram Logo"
        width={100}
        height={100}
        className="rounded-full border-4 border-pink-300 shadow-md"
        loading="lazy"
      />
  </div>

  <p className="text-center text-lg text-pink-800 font-medium mb-3">@toybazaar1608</p>
  <p className="text-center text-gray-700 mb-8 max-w-xs mx-auto">
    Discover new toys, happy customers, and behind-the-scenes magic!
  </p>

  <a
    href="https://www.instagram.com/toybazaar1608/"
    target="_blank"
    rel="noopener noreferrer"
    className="block mx-auto max-w-max bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 text-white font-semibold px-8 py-3 rounded-full shadow transition"
  >
    🌟 View Our Instagram
  </a>
</section>


    </main>
  );
}
