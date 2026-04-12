import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ALL_PARADIGMS, formatParadigmTitle } from '#/lib/verb-matrix'

export type VerbParadigmsSelectorProps = {
  /** Summary text on the closed trigger (e.g. “3 tenses” or tense names). */
  triggerLabel: string
  /** Which paradigms are checked (must stay non-empty). */
  selectedSet: ReadonlySet<string>
  onToggleParadigm: (paradigm: string) => void
  /** Visible label above the control (default: “Tenses”). */
  fieldLabel?: string
  /** `aria-label` on the trigger button. */
  triggerAriaLabel?: string
  /** `aria-label` on the listbox. */
  listboxAriaLabel?: string
}

export function VerbParadigmsSelector({
  triggerLabel,
  selectedSet,
  onToggleParadigm,
  fieldLabel = 'Tenses',
  triggerAriaLabel = 'Select tenses',
  listboxAriaLabel = 'Select tenses',
}: VerbParadigmsSelectorProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e: PointerEvent) {
      const el = menuRef.current
      if (el && !el.contains(e.target as Node)) setMenuOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <div className="form-control w-full shrink-0 lg:w-64">
      <div className="label pt-0 pb-2">
        <span className="label-text font-medium">{fieldLabel}</span>
      </div>
      <div className="relative w-full" ref={menuRef}>
        <button
          type="button"
          className="select select-bordered flex w-full cursor-pointer items-center justify-between gap-2 text-left font-normal"
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
          aria-label={triggerAriaLabel}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="min-w-0 flex-1 truncate">{triggerLabel}</span>
          <ChevronDown
            className={`size-4 shrink-0 opacity-60 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {menuOpen ? (
          <ul
            role="listbox"
            aria-label={listboxAriaLabel}
            aria-multiselectable
            className="absolute right-0 z-50 mt-1 max-h-72 min-w-full overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-lg sm:min-w-[18rem]"
          >
            {ALL_PARADIGMS.map((p) => (
              <li key={p} className="rounded-lg px-1 py-0.5 hover:bg-base-200">
                <label className="flex cursor-pointer items-center gap-2 py-1.5 pl-1 pr-2 text-sm">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary shrink-0"
                    checked={selectedSet.has(p)}
                    onChange={() => onToggleParadigm(p)}
                  />
                  <span className="leading-snug">{formatParadigmTitle(p)}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
