import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Returns the page numbers to show, e.g. [1, 2, 3, '...', 10]
function getPageNumbers(page: number, totalPages: number) {
  const start = Math.max(1, Math.min(page - 1, totalPages - 2))
  const end = Math.min(totalPages, start + 2)

  const pages: (number | '...')[] = []
  if (start > 1) pages.push(1)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push('...')
  if (end < totalPages) pages.push(totalPages)

  return pages
}

function PageButton({
  children,
  active = false,
  disabled = false,
  label,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  disabled?: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-7 shrink-0 sm:size-8 items-center justify-center rounded-full border border-neutral-200 text-xs font-medium sm:text-sm hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40',
        active && 'border-blue-500 bg-blue-500 text-white hover:bg-blue-500',
      )}
    >
      {children}
    </button>
  )
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-0.5 sm:gap-1.5">
      <PageButton label="First page" disabled={page === 1} onClick={() => onPageChange(1)}>
        <ChevronsLeft className="size-3.5" />
      </PageButton>
      <PageButton label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="size-3.5" />
      </PageButton>

      {getPageNumbers(page, totalPages).map((item, index) =>
        item === '...' ? (
          <span key={`dots-${index}`} className="w-4 text-center text-xs sm:w-8 sm:text-sm">
            ...
          </span>
        ) : (
          <PageButton
            key={item}
            label={`Page ${item}`}
            active={item === page}
            onClick={() => onPageChange(item)}
          >
            {item}
          </PageButton>
        ),
      )}

      <PageButton label="Next page" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        <ChevronRight className="size-3.5" />
      </PageButton>
      <PageButton label="Last page" disabled={page === totalPages} onClick={() => onPageChange(totalPages)}>
        <ChevronsRight className="size-3.5" />
      </PageButton>
    </nav>
  )
}
