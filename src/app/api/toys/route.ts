import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB as string;
    if (!dbName) {
      return NextResponse.json({ error: "MONGODB_DB is not set" }, { status: 500 });
    }

    const db = client.db(dbName);
    const collection = db.collection("toys");

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sortParam = searchParams.get("sort") || "popularity";

    const query: any = {};
    if (category && category !== "All") {
      query.category = category;
    }

    const sort: Record<string, 1 | -1> = {};
    switch (sortParam) {
      case "price-low":
        sort.price = 1;
        break;
      case "price-high":
        sort.price = -1;
        break;
      case "newest":
        // Prefer common created fields; fallback to ObjectId timestamp
        // Mongo will ignore missing keys; combine by priority
        sort.created = -1 as -1;
        sort.createdAt = -1 as -1;
        sort._id = -1;
        break;
      case "popularity":
      default:
        sort.popularity = -1;
        sort._id = -1;
        break;
    }

    const docs = await collection
      .find(query, { projection: { name: 1, price: 1, images: 1, category: 1, popularity: 1, createdAt: 1, slug: 1 , stock:1} })
      .sort(sort)
      .limit(100)
      .toArray();

    const toys = docs.map((doc: any) => ({
      id: String(doc._id),
      name: doc.name,
      price: typeof doc.price === "number" ? doc.price : Number(doc.price),
      images: Array.isArray(doc.images) ? doc.images : [],
      category: Array.isArray(doc.category) ? doc.category : [],
      popularity: typeof doc.popularity === "number" ? doc.popularity : 0,
      stock: doc.stock,
      slug: typeof doc.slug === "string" && doc.slug.length > 0
        ? doc.slug
        : String(doc.name || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-"),
    }));

    return NextResponse.json(toys, { status: 200 });
  } catch (error) {
    console.error("/api/toys GET error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


