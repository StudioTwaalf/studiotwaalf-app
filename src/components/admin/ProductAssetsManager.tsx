'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Asset {
  id: string
  url: string
  altNl: string | null
  sortOrder: number
}

interface Props {
  productId: string
  initialAssets: Asset[]
}

export default function ProductAssetsManager({ productId, initialAssets }: Props) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)

    try {
      // 1. Upload file
      const form = new FormData()
      form.append('file', file)
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({})) as { error?: string }
        throw new Error(err.error ?? 'Upload mislukt')
      }
      const { url } = await uploadRes.json() as { url: string }

      // 2. Create asset record
      const assetRes = await fetch(`/api/admin/products/${productId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, altNl: file.name.replace(/\.[^.]+$/, '') }),
      })
      if (!assetRes.ok) throw new Error('Kon afbeelding niet opslaan')
      const newAsset = await assetRes.json() as Asset

      setAssets((prev) => [...prev, newAsset])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete(assetId: string) {
    if (!confirm('Afbeelding verwijderen?')) return
    const res = await fetch(`/api/admin/products/${productId}/assets/${assetId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== assetId))
    }
  }

  return (
    <div className="space-y-3">
      {/* Existing assets grid */}
      {assets.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {assets.map((asset, i) => (
            <div key={asset.id} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                <Image
                  src={asset.url}
                  alt={asset.altNl ?? ''}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Order badge */}
              <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {i + 1}
              </span>
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleDelete(asset.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5
                           items-center justify-center hidden group-hover:flex transition-all"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300
                     rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600
                     transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Uploaden…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Afbeelding toevoegen
            </>
          )}
        </button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {assets.length === 0 && !uploading && (
          <p className="mt-1 text-xs text-gray-400">
            Nog geen productafbeeldingen. De eerste afbeelding wordt de hoofdfoto.
          </p>
        )}
      </div>
    </div>
  )
}
