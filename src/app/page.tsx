import Link from "next/link";
import ToysListPage from "./toys/page";

export default function Home() {
  return (
    // <main className="min-h-screen bg-gradient-to-br from-pink-300 via-blue-300 to-blue-600 text-white flex flex-col items-center justify-center px-6">
    //   <h1 className="text-5xl md:text-7xl font-extrabold text-center leading-tight drop-shadow-lg">
    //     Welcome to <span className="text-white">Toy Bazaar</span>
    //   </h1>
    //   <p className="mt-6 text-lg md:text-xl text-center max-w-xl text-white">
    //     Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, voluptas.
    //   </p>
    //   <div className="mt-10 flex gap-4">
    //     <Link
    //       href="/toys"
    //       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
    //     >
    //       Get Started
    //     </Link>
    //     <Link
    //       href="/about "
    //       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
    //     >
    //       Connect With Us
    //     </Link>
    //   </div>
    // </main>
     <ToysListPage/>

  );
}
