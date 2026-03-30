'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface Category {
  id: string
  slug: string
  nameNl: string
}

interface CategoryParent extends Category {
  children: Category[]
}

interface Props {
  categoryParents: CategoryParent[]
}

export default function CategoryFilterPills({ categoryParents }: Props) {
  const router   = useRouter()
  const pathname = usePathname()
  const sp       = useSearchParams()
  const active   = sp.get('categorie')
  const q        = sp.get('q') ?? ''

  // Active parent = directly selected parent, OR parent of a selected child
  const activeParent = categoryParents.find(
    (p) => p.slug === active || p.children.some((c) => c.slug === active)
  )

  function set(key: string, value: string | null) {
    const params = new URLSearchParams(sp.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const parentActive = 'bg-[#2C2416] text-white shadow-sm'
  const parentIdle   = 'bg-white border border-[#E0D5C5] text-[#7A6A52] hover:bg-[#F5F0E8]'
  const subActive    = 'bg-[#C9A96E] text-white shadow-sm'
  const subIdle      = 'bg-[#F5EFE4] border border-[#D5C5A8] text-[#8A7055] hover:bg-[#EDE4D2]'

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* ── Row 1: search + sort spacer ─────────────────────────────── */}
      <div className="relative w-full sm:max-w-xs">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B5A48A] pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
        </svg>
        <input
          type="search"
          placeholder="Zoeken in de webshop…"
          defaultValue={q}
          onChange={(e) => set('q', e.target.value || null)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-[#E0D5C5] rounded-full bg-white
                     text-[#4A3C2C] placeholder-[#B5A48A]
                     focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E]
                     transition-colors"
        />
      </div>

      {/* ── Row 2: hoofdcategorieën ──────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={() => set('categorie', null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer
            ${!active ? parentActive : parentIdle}`}
        >
          Alles
        </button>

        {categoryParents.map((p) => {
          const isActive = active === p.slug || p.children.some((c) => c.slug === active)
          return (
            <button
              key={p.slug}
              onClick={() => set('categorie', p.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer
                ${isActive ? parentActive : parentIdle}`}
            >
              {p.nameNl}
              {p.children.length > 0 && (
                <span className={`ml-1.5 text-xs ${isActive ? 'opacity-60' : 'opacity-40'}`}>
                  ›
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Row 3: subcategorieën (alleen als geselecteerde parent kinderen heeft) ── */}
      {activeParent && activeParent.children.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 pl-2
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* "Alles in X" knop */}
          <button
            onClick={() => set('categorie', activeParent.slug)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer
              ${active === activeParent.slug ? subActive : subIdle}`}
          >
            Alle {activeParent.nameNl}
          </button>

          {activeParent.children.map((c) => (
            <button
              key={c.slug}
              onClick={() => set('categorie', c.slug)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer
                ${active === c.slug ? subActive : subIdle}`}
            >
              {c.nameNl}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
