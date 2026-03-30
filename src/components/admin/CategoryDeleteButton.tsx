'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCategoryAction } from '@/app/admin/gadgets/categories/actions'

interface Props {
  id:           string
  name:         string
  canDelete:    boolean
  blockReason?: string
}

export default function CategoryDeleteButton({ id, name, canDelete, blockReason }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    if (!window.confirm(`"${name}" verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return
    startTransition(async () => {
      const result = await deleteCategoryAction(id)
      if (result.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canDelete || isPending}
      title={blockReason ?? 'Verwijderen'}
      aria-label={`${name} verwijderen`}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors
                 text-red-400 hover:text-red-600 hover:bg-red-50
                 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}
