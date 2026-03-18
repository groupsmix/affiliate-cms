import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import styles from './page.module.css';

export const runtime = 'edge';

export const metadata = {
  title: siteConfig.pages.disclosure.title,
  description: siteConfig.pages.disclosure.description,
};

export default function DisclosurePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>سياسة الإفصاح</h1>

      <div className={styles.highlight}>
        <p>
          موقع أدوات البريد يحتوي على روابط تسويقية (affiliate links). هذا يعني
          أننا قد نحصل على عمولة عند الشراء من خلال الروابط الموجودة في
          مقالاتنا، دون أي تكلفة إضافية عليك.
        </p>
      </div>

      <div className={styles.body}>
        <section className={styles.section}>
          <h2>كيف نكسب</h2>
          <p>
            عندما تنقر على رابط منتج في موقعنا وتقوم بالشراء أو التسجيل، قد
            نحصل على عمولة من الشركة المقدمة للخدمة. هذه العمولة تساعدنا في
            تغطية تكاليف تشغيل الموقع وإنتاج المحتوى.
          </p>
        </section>

        <section className={styles.section}>
          <h2>استقلالية التحرير</h2>
          <p>
            وجود الروابط التسويقية لا يؤثر على تقييماتنا أو توصياتنا. جميع
            المراجعات والمقارنات مبنية على تجربة فعلية وتقييم موضوعي. لن نوصي
            بمنتج لمجرد أنه يقدم عمولة أعلى.
          </p>
        </section>

        <section className={styles.section}>
          <h2>التزامنا</h2>
          <p>
            نلتزم بالشفافية الكاملة مع قرائنا. هدفنا الأول هو مساعدتك في اتخاذ
            القرار الأفضل لاحتياجاتك، وليس بيع منتج بعينه. إذا كان المنتج غير
            مناسب، سنخبرك بذلك بصراحة.
          </p>
        </section>

        <section className={styles.section}>
          <h2>أسئلة؟</h2>
          <p>
            إذا كان لديك أي سؤال حول سياسة الإفصاح أو الروابط التسويقية في
            موقعنا، يمكنك{' '}
            <Link href="/about" className={styles.link}>
              التعرف على الموقع
            </Link>{' '}
            أو التواصل معنا مباشرة.
          </p>
        </section>
      </div>
    </div>
  );
}
