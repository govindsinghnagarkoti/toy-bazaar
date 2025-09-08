import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, type Document } from "mongodb";

type Params = { params: { id: string } };

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params; // Await params because it's a Promise

  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB as string;
    if (!dbName) {
      return NextResponse.json({ error: "MONGODB_DB is not set" }, { status: 500 });
    }

    const db = client.db(dbName);
    const collection = db.collection("toys");

    const idOrSlug = id;
    let doc: Document | null = null;
    if (ObjectId.isValid(idOrSlug)) {
      doc = await collection.findOne({ _id: new ObjectId(idOrSlug) });
    } else {
      // Try by slug first
      doc = await collection.findOne({ slug: idOrSlug });
      if (!doc) {
        // Fallback: build a tolerant regex from the slug tokens
        const slug = String(idOrSlug).toLowerCase().trim();
        const tokens = slug.split(/-+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        if (tokens.length > 0) {
          // Try strict token order with non-alnum separators and anchors
          const anchored = `^\\s*${tokens.join("[^a-z0-9]+")}\\s*$`;
          doc = await collection.findOne({ name: { $regex: new RegExp(anchored, "i") } });
        }
        if (!doc && tokens.length > 0) {
          // Looser fallback: allow any characters between tokens, no anchors
          const loose = tokens.join(".*");
          doc = await collection.findOne({ name: { $regex: new RegExp(loose, "i") } });
        }
      }
    }
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const toy = {
      id: String(doc._id),
      name: doc.name,
      price: doc.price,
      description: doc.description ?? "",
      images: doc.images ?? [],
      category: doc.category ?? [],
      slug: typeof doc.slug === "string" && doc.slug.length > 0
        ? doc.slug
        : String(doc.name || "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-"),
    };

    // Increment popularity asynchronously (fire-and-forget)
    try {
      if (doc?._id) {
        await collection.updateOne({ _id: doc._id }, { $inc: { popularity: 1 } });
      }
    } catch (e) {
      console.warn("Failed to increment popularity for", idOrSlug, e);
    }

    return NextResponse.json(toy, { status: 200 });
  } catch (error) {
    console.error("/api/toys/[id] GET error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;

  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB as string;
    if (!dbName) {
      return NextResponse.json({ error: "MONGODB_DB is not set" }, { status: 500 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const payload = await request.json();
    const update: Record<string, unknown> = {};

    if (typeof payload.name === "string") update.name = payload.name.trim();
    if (typeof payload.description === "string") update.description = payload.description;
    if (typeof payload.price === "number") update.price = payload.price;
    if (Array.isArray(payload.category)) update.category = payload.category;
    if (Array.isArray(payload.images)) update.images = payload.images;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const db = client.db(dbName);
    const collection = db.collection("toys");
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const doc = result as Document;
    const toy = {
      id: String(doc._id),
      name: doc.name,
      price: doc.price,
      description: doc.description ?? "",
      images: doc.images ?? [],
      category: doc.category ?? [],
    };

    return NextResponse.json(toy, { status: 200 });
  } catch (error) {
    console.error("/api/toys/[id] PATCH error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params; // Await the promise for params
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB as string;
    if (!dbName) {
      return NextResponse.json({ error: "MONGODB_DB is not set" }, { status: 500 });
    }
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = client.db(dbName);
    const collection = db.collection("toys");
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { popularity: 1 } },
      { returnDocument: "after" }
    );
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const doc = result as Document;
    return NextResponse.json({ popularity: typeof doc.popularity === "number" ? doc.popularity : 0 }, { status: 200 });
  } catch (error) {
    console.error("/api/toys/[id] POST error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


