import { useState } from 'react'
import { Icon } from './Icons'
import { Mascot } from './Mascot'
import { useTranslate } from '../i18n/i18n'

type OnboardingOverlayProps = {
  onComplete: () => void
}

const ONBOARDING_KEY = 'little-math-onboarding'

export function shouldShowOnboarding(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) !== 'done'
  } catch {
    return true
  }
}

export function markOnboardingDone() {
  try {
    window.localStorage.setItem(ONBOARDING_KEY, 'done')
  } catch {
    // ignore
  }
}

const stepIcons: Record<number, React.ReactNode> = {
  0: <Icon name="rotate" size={22} />,
  1: <Icon name="cursor" size={22} />,
  2: <Icon name="layers" size={22} />,
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const t = useTranslate()
  const [step, setStep] = useState(0)

  const steps = [t('onboardingStep1'), t('onboardingStep2'), t('onboardingStep3')]
  const isLast = step === 2

  const handleNext = () => {
    if (isLast) {
      markOnboardingDone()
      onComplete()
    } else {
      setStep((s) => s + 1)
    }
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-label={t('onboardingTitle')}>
      <div className="onboarding-card">
        <div className="onboarding-header">
          <Mascot small />
          <h2>{t('onboardingTitle')}</h2>
        </div>

        <div className="onboarding-step-icon">{stepIcons[step]}</div>
        <p className="onboarding-text">{steps[step]}</p>

        <div className="onboarding-dots" aria-label={`Step ${step + 1} of 3`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        <div className="onboarding-actions">
          <button className="onboarding-skip" type="button" onClick={() => { markOnboardingDone(); onComplete() }}>
            {t('onboardingSkip')}
          </button>
          <button className="primary-button onboarding-next" type="button" onClick={handleNext}>
            <span>{isLast ? t('onboardingStart') : t('onboardingNext')}</span>
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
