import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import styles from './page.module.css';

export const runtime = 'edge';

export const metadata = {
  title: 'الإفصاح — أدوات البريد',
  description: 'سياسة الإفصاح عن الروابط التسويقية في موقع أدوات البريد',
};

export default function DisclosurePage() {
  return (
    <>
      <PublicHeader />
      <div className={styles.container}>
        <h1 className={styles.title}>الإفصاح</h1>
        <div className={styles.body}>
          <p>
            موقع أدوات البريد يحتوي على روابط تسويقية (affiliate links). هذا يعني أننا
            قد نحصل على عمولة عند الشراء من خلال الروابط الموجودة في مقالاتنا، دون أي
            تكلفة إضافية عليك.
          </p>

          <h2>كيف نكسب</h2>
          <p>
            عندما تنقر على رابط منتج في موقعنا وتقوم بالشراء أو التسجيل، قد نحصل على
            عمولة من الشركة المقدمة للخدمة. هذه العمولة تساعدنا في تغطية تكاليف تشغيل
            الموقع وإنتاج المحتوى.
          </p>

          <h2>استقلالية التحرير</h2>
          <p>
            وجود الروابط التسويقية لا يؤثر على تقييماتنا أو توصياتنا. جميع المراجعات
            والمقارنات مبنية على تجربة فعلية وتقييم موضوعي. لن نوصي بمنتج لمجرد أنه
            يقدم عمولة أعلى.
          </p>

          <h2>التزامنا</h2>
          <p>
            نلتزم بالشفافية الكاملة مع قرائنا. هدفنا الأول هو مساعدتك في اتخاذ القرار
            الأفضل لاحتياجاتك، وليس بيع منتج بعينه. إذا كان المنتج غير مناسب،
            سنخبرك بذلك بصراحة.
          </p>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
