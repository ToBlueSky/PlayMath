import { Icon } from '../components/Icons'
import { TilingGrid } from '../components/TilingGrid'
import { useTranslate } from '../i18n/i18n'

export function PlaygroundPage({ onBack }: { onBack: () => void }) {
  const t = useTranslate()
  return (
    <main className="lesson-page page-width">
      <div className="lesson-breadcrumb"><button className="back-button" type="button" onClick={onBack}><Icon name="back" size={17} />{t('backToExplore')}</button><span>/</span><span>{t('tilingKicker')}</span><span>/</span><strong>{t('tilingTitle')}</strong></div>
      <div className="lesson-title-row"><div><span className="section-kicker">{t('tilingKicker')}</span><h1>{t('tilingTitle')}</h1></div></div>
      <div className="playground-layout">
        <section className="workbench-card">
          <p className="playground-desc">{t('tilingDesc')}</p>
          <TilingGrid />
        </section>
      </div>
    </main>
  )
}
