import type { VerbsPageQuery } from '#/graphql/__generated__/graphql'
import {
  type PersonKey,
  PERSON_ROWS,
  formatParadigmTitle,
  type VerbFormFields,
} from '#/lib/verb-matrix'

export type VerbForMatrix = VerbsPageQuery['verbs']['results'][number]

function formByParadigm(forms: VerbFormFields[], paradigm: string) {
  return forms.find((f) => f.paradigm === paradigm)
}

export function VerbFormsMatrix({
  verb,
  columnParadigms,
}: {
  verb: VerbForMatrix
  /** Column order matches the GraphQL `forms(paradigms: …)` request. */
  columnParadigms: readonly string[]
}) {
  if (columnParadigms.length === 0) {
    return (
      <p className="text-sm text-base-content/60">
        Select at least one paradigm to show the conjugation table.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-base-300">
      <table className="table table-zebra table-sm min-w-max">
        <thead>
          <tr>
            <th className="bg-base-200 font-semibold">Person</th>
            {columnParadigms.map((p) => (
              <th key={p} className="bg-base-200 text-center font-semibold">
                <span className="whitespace-nowrap">{formatParadigmTitle(p)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERSON_ROWS.map((row) => (
            <tr key={row.key}>
              <th scope="row" className="whitespace-nowrap font-normal">
                {row.label}
              </th>
              {columnParadigms.map((paradigm) => {
                const form = formByParadigm(verb.forms, paradigm)
                const cell = form?.[row.key as PersonKey] ?? '—'
                return (
                  <td key={paradigm} className="text-center">
                    {cell}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
