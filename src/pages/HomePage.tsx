import { Icon } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import { useTranslate } from '../i18n/i18n'

type HomePageProps = {
  progress: number
  lessonComplete: boolean
  cubeComplete: boolean
  onOpenLesson: () => void
  onOpenCube: () => void
  onOpenPlayground: () => void
}

export function HomePage({ progress, lessonComplete, cubeComplete, onOpenLesson, onOpenCube, onOpenPlayground }: HomePageProps) {
  const t = useTranslate()
  return (
    <main className="home-page">
      <section className="home-hero page-width">
        <div className="hero-copy">
          <div className="eyebrow-pill"><span className="eyebrow-dot" />{t('heroEyebrow')}</div>
          <h1>{t('heroTitle1')}<br /><em>{t('heroTitle2')}</em></h1>
          <p className="hero-description">{t('heroDescription')}</p>
          <button className="primary-button hero-button" type="button" onClick={onOpenLesson}>
            <span>{lessonComplete ? t('heroContinue') : t('heroStart')}</span>
            <Icon name="arrow" size={19} />
          </button>
          <div className="hero-trust"><span className="trust-stars">✦ ✦ ✦</span><span>{t('trustGrade')}</span><span className="trust-divider" /><span>{t('trustTime')}</span></div>
        </div>
        <div className="hero-art" aria-label="数学小方块正在探索长方体">
          <div className="sun-disc" />
          <div className="doodle doodle-cross">+</div>
          <div className="doodle doodle-circle">○</div>
          <div className="doodle doodle-star">✦</div>
          <div className="art-ground" />
          <div className="floating-cube cube-one"><span /></div>
          <div className="floating-cube cube-two"><span /></div>
          <Mascot />
          <div className="speech-bubble"><span>{t('speech')}</span><i /></div>
        </div>
      </section>

      <section className="home-content page-width">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t('sectionKicker')}</span>
            <h2>{t('homeHeading')}</h2>
          </div>
          <button className="text-button" type="button" onClick={onOpenLesson}>{t('seeAll')} <Icon name="arrow" size={15} /></button>
        </div>

        <div className="explore-grid">
          <button className="explore-card featured-card" type="button" onClick={onOpenLesson}>
            <div className="card-topline"><span className="status-chip"><span />{t('learningChip')}</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="featured-illustration"><div className="illustration-shadow" /><div className="illustration-box"><i /><b /><strong /></div><div className="illustration-ruler">↔</div></div>
            <div className="card-copy">
              <span className="card-kicker">{t('card1Kicker')}</span>
              <h3>{t('card1Title')}</h3>
              <p>{t('card1Desc')}</p>
              <div className="progress-row"><span className="progress-track"><i style={{ width: `${progress}%` }} /></span><strong>{progress ? `${progress}%` : t('progressReady')}</strong></div>
            </div>
          </button>
          <button className="explore-card coming-card" type="button" onClick={onOpenCube}>
            <div className="card-topline"><span className="status-chip muted-chip">{cubeComplete ? t('learningChip') : t('card2Chip')}</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="coming-illustration"><div className="triangle-shape" /><div className="circle-shape" /><div className="square-shape" /><span>?</span></div>
            <div className="card-copy"><span className="card-kicker">{t('card2Kicker')}</span><h3>{t('card2Title')}</h3><p>{t('card2Desc')}</p><span className="coming-link">{t('enterCube')} <Icon name="arrow" size={14} /></span></div>
          </button>
          <button className="explore-card free-card" type="button" onClick={onOpenPlayground}>
            <div className="card-topline"><span className="status-chip free-chip">{t('freeChip')}</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="free-illustration"><span className="free-block block-a" /><span className="free-block block-b" /><span className="free-block block-c" /><span className="free-block block-d" /><span className="free-sparkle">✦</span></div>
            <div className="card-copy"><span className="card-kicker">{t('freeKicker')}</span><h3>{t('freeTitle')}</h3><p>{t('freeDesc')}</p><span className="coming-link dark-link">{t('enterPlayground')} <Icon name="arrow" size={14} /></span></div>
          </button>
        </div>

        <div className="home-bottom-grid">
          <div className="daily-card">
            <div className="daily-icon"><Icon name="sparkle" size={24} /></div>
            <div><span className="section-kicker">{t('dailyKicker')}</span><h3>{t('dailyTitle')}</h3><p>{t('dailyDesc')}</p></div>
            <button className="round-arrow" type="button" onClick={onOpenLesson} aria-label={t('dailyKicker')}><Icon name="arrow" size={18} /></button>
          </div>
          <div className="streak-card"><div className="streak-orbit"><span>3</span><i>{t('streakDays')}</i></div><div><span className="section-kicker">{t('streakKicker')}</span><h3>{t('streakTitle')}</h3><p>{t('streakDesc')}</p></div><span className="streak-star">✦</span></div>
        </div>
      </section>
    </main>
  )
}
