"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ToyForm = {
  name: string;
  description: string;
  price: number;
  category: string[];
  images: string[];
};

export default function EditToyPage() {
  const params = useParams();
  const router = useRouter();
  const bucketUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL as string | undefined;
  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_REST_URL as string | undefined;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ToyForm>({ name: "", description: "", price: 0, category: [], images: [] });
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/toys/${params.id}`);
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const data = await res.json();
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          price: Number(data.price ?? 0),
          category: Array.isArray(data.category) ? data.category : [],
          images: Array.isArray(data.images) ? data.images : [],
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) load();
  }, [params]);

  const canUpload = useMemo(() => Boolean(bucketUrl && serviceUrl && anonKey), [bucketUrl, serviceUrl, anonKey]);

  const handleUpload = async (file: File) => {
    if (!canUpload) {
      throw new Error("Supabase env not configured");
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${params.id}-${Date.now()}.${fileExt}`;
    // Upload via Supabase Storage API
    const uploadUrl = `${serviceUrl}/storage/v1/object/toys/${fileName}`;
    // Use XHR to track progress (better for mobile feedback)
    const publicUrl = `${bucketUrl}/toys/${fileName}`;
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl, true);
      xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`!);
      xhr.setRequestHeader("apikey", anonKey!);
      xhr.setRequestHeader("x-upsert", "true");
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setUploadProgress(pct);
        }
      };
      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
      };
      xhr.send(file);
    });
    return publicUrl;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/toys/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      router.push(`/toys/${params.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Save failed";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Toy</h1>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-24"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              min={0}
              step="1"
              className="w-full border rounded px-3 py-2"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categories (comma separated)</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.category.join(", ")}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="space-y-2">
              {form.images.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="flex-1 border rounded px-3 py-2"
                    value={url}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((f) => ({ ...f, images: f.images.map((u, i) => (i === idx ? v : u)) }));
                    }}
                  />
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-pink-600 font-semibold"
                onClick={() => setForm((f) => ({ ...f, images: [...f.images, ""] }))}
              >
                + Add Image URL
              </button>
              <div className="pt-2">
                <label className="block text-sm font-medium mb-1">Upload to Supabase</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    if (files.length === 0) return;
                    setUploading(true);
                    setUploadError(null);
                    setUploadProgress(0);
                    try {
                      for (const file of files) {
                        const url = await handleUpload(file);
                        setForm((f) => ({ ...f, images: [...f.images, url] }));
                      }
                    } catch (err) {
                      const message = err instanceof Error ? err.message : "Upload failed";
                      setUploadError(message);
                    } finally {
                      setUploading(false);
                      setUploadProgress(0);
                      if (e.target) e.target.value = "";
                    }
                  }}
                />
                {uploading && (
                  <div className="mt-2 text-sm text-gray-700">Uploading… {uploadProgress}%</div>
                )}
                {uploadError && (
                  <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                )}
                {!canUpload && (
                  <p className="text-xs text-gray-500 mt-1">Set NEXT_PUBLIC_SUPABASE_REST_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_STORAGE_URL</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold shadow hover:bg-pink-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}


