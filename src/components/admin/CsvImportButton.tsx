'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  importUrl: string
  templateUrl: string
  label?: string
}

export default function CsvImportButton({ importUrl, templateUrl, label = 'gadgets' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()
  const [status, setStatus] = useState<{ type: 'loading' | 'success' | 'error'; msg: string } | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus({ type: 'loading', msg: 'Bezig met importeren…' })

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res  = await fetch(importUrl, { method: 'POST', body: fd })
      const data = await res.json() as { created: number; errors: string[]; error?: string }

      if (!res.ok) {
        setStatus({ type: 'error', msg: data.error ?? 'Fout bij importeren' })
        return
      }

      const parts: string[] = []
      if (data.created > 0) parts.push(`${data.created} ${label} aangemaakt`)
      if (data.errors?.length) {
        parts.push(`${data.errors.length} fout${data.errors.length !== 1 ? 'en' : ''}`)
        console.error('CSV import fouten:', data.errors)
      }

      setStatus({
        type: data.errors?.length ? 'error' : 'success',
        msg: parts.join(' · '),
      })
      router.refresh()
    } catch {
      setStatus({ type: 'error', msg: 'Netwerkfout bij uploaden' })
    }

    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFile}
      />

      <a
        href={templateUrl}
        className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2"
      >
        CSV sjabloon
      </a>

      <button
        onClick={() => { setStatus(null); inputRef.current?.click() }}
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-300
                   bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        CSV importeren
      </button>

      {status && (
        <span className={[
          'text-xs',
          status.type === 'success' ? 'text-green-600' :
          status.type === 'error'   ? 'text-red-600'   : 'text-gray-400',
        ].join(' ')}>
          {status.msg}
        </span>
      )}
    </div>
  )
}
