import { PROFILE } from '../data/profile';
import { useLang } from '../i18n/lang';
import { useFileExists } from '../hooks/useFileExists';

/* « Télécharger le CV » — n'apparaît que si public/media/cv-matthew-le.pdf existe. */
export default function CvButton({ className = 'btn accent' }) {
  const { t } = useLang();
  const has = useFileExists(PROFILE.cv);
  if (!has) return null;
  return (
    <a className={className} href={PROFILE.cv} download data-cursor="PDF">
      <span className="fill" /><span className="dot-arrow" /><span className="lbl">{t('Télécharger le CV', 'Download CV')}</span>
    </a>
  );
}
