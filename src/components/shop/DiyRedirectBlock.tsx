/**
 * DiyRedirectBlock
 *
 * Shown on a webshop product page when the product requires the DIY flow.
 * UX philosophy: the customer is here to BUY a gadget, not design a full concept.
 *
 * Primary CTA  → direct to gadget editor (skip card design)
 * Secondary    → small text link for full DIY concept (opt-in, not default)
 */

import Link from 'next/link'

interface Props {
  diyTemplateId: string | null
  productName:   string
  productId?:    string
}

export default function DiyRedirectBlock({ diyTemplateId, productName, productId }: Props) {
  const quickHref = diyTemplateId
    ? `/design/${diyTemplateId}/quick-gadgets${productId ? `?product=${productId}` : ''}`
    : '/templates'
  const fullHref  = diyTemplateId ? `/design/${diyTemplateId}/concept` : '/templates'

  return (
    <div className="space-y-3">

      {/* Personalisatie uitleg */}
      <div className="bg-[#FAF7F0] border border-[#EDE0C4] rounded-2xl p-4">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-xl bg-[#F5EDD5] border border-[#E8D9BC]
                          flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3.5 h-3.5 text-[#8B6F3E]" fill="none" stroke="currentColor"
                 strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 11l6.5-6.5a2 2 0 012.828 2.828
                   L11.828 13.828a4 4 0 01-1.414.94l-3 1a.5.5 0 01-.636-.636
                   l1-3A4 4 0 019 11z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#4A3520] leading-snug mb-0.5">
              Personaliseerbaar product
            </p>
            <p className="text-xs text-[#7A6A52] leading-relaxed">
              Voeg jouw persoonlijke touch toe — naam, tekst of kleur — en
              bekijk het resultaat direct voor je bestelt.
            </p>
          </div>
        </div>
      </div>

      {/* Primaire CTA — direct naar gadgets */}
      <Link
        href={quickHref}
        className="flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-2xl
                   bg-[#2C2416] text-white text-sm font-semibold
                   hover:bg-[#3C3020] active:scale-[0.98]
                   transition-all duration-150 tracking-wide"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor"
             strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
               m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828
               l8.586-8.586z" />
        </svg>
        Samenstellen &amp; bestellen
      </Link>

      {/* Secundaire optie — volledig concept (subtiel) */}
      {diyTemplateId && (
        <p className="text-[11px] text-center text-[#A0907A] leading-relaxed">
          Wil je ook een kaartje ontwerpen?{' '}
          <Link
            href={fullHref}
            className="underline underline-offset-2 hover:text-[#6B5230] transition-colors"
          >
            Start een volledig concept
          </Link>
        </p>
      )}

    </div>
  )
}
