import {
  createContentStub,
  attachProduct,
  updateContentBody,
  setStatus,
} from '../lib/admin.js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.'
  );
}

const adminClient = createClient(supabaseUrl, serviceRoleKey);

async function seed() {
  // 1. Find existing category
  const { data: category, error: catErr } = await adminClient
    .from('categories')
    .select('id')
    .eq('slug', 'newsletter-tools')
    .single();

  if (catErr) throw new Error(`Category lookup failed: ${catErr.message}`);
  console.log('Category found:', category.id);

  // 2. Find existing product
  const { data: product, error: prodErr } = await adminClient
    .from('products')
    .select('id')
    .eq('slug', 'mailchimp')
    .single();

  if (prodErr) throw new Error(`Product lookup failed: ${prodErr.message}`);
  console.log('Product found:', product.id);

  // 3. Create review article stub
  const slug = 'mailchimp-review';
  const contentId = await createContentStub({
    title: 'مراجعة شاملة لـ Mailchimp — هل يستحق التجربة؟',
    slug,
    contentType: 'review',
    categoryId: category.id,
    primaryKeyword: 'مراجعة Mailchimp',
  });
  console.log('Content created:', contentId);

  // 4. Update body, excerpt, and meta
  await updateContentBody({
    contentId,
    body: `
      <h2>ما هو Mailchimp؟</h2>
      <p>Mailchimp هو أحد أشهر أدوات التسويق عبر البريد الإلكتروني في العالم، ويُستخدم من قِبل ملايين الشركات الصغيرة والمتوسطة لإدارة حملات البريد الإلكتروني والنشرات البريدية.</p>

      <h2>المميزات الرئيسية</h2>
      <ul>
        <li>محرر سحب وإفلات سهل الاستخدام لتصميم الرسائل</li>
        <li>أتمتة البريد الإلكتروني وإرسال رسائل مجدولة</li>
        <li>تقارير وتحليلات مفصلة لأداء الحملات</li>
        <li>تكامل مع أكثر من 300 تطبيق وخدمة</li>
      </ul>

      <h2>التسعير</h2>
      <p>يوفر Mailchimp خطة مجانية تدعم حتى 500 جهة اتصال، مع خطط مدفوعة تبدأ من 13 دولار شهريًا للميزات المتقدمة مثل الأتمتة واختبار A/B.</p>

      <h3>هل يناسب المستخدم العربي؟</h3>
      <p>على الرغم من أن واجهة Mailchimp متاحة بالإنجليزية فقط، إلا أنه يدعم إرسال رسائل بالعربية بشكل كامل مع دعم RTL في القوالب.</p>
    `,
    excerpt: 'مراجعة تفصيلية لأداة Mailchimp للتسويق عبر البريد الإلكتروني — المميزات والعيوب والتسعير.',
    metaTitle: 'مراجعة Mailchimp 2025 — المميزات والتسعير والبدائل',
    metaDescription: 'مراجعة شاملة لـ Mailchimp: هل هو الخيار الأفضل للتسويق عبر البريد الإلكتروني؟ تعرف على المميزات والعيوب والتسعير.',
  });
  console.log('Content body updated');

  // 5. Attach Mailchimp product as primary
  await attachProduct({
    contentId,
    productId: product.id,
    placement: 'primary',
    displayOrder: 1,
  });
  console.log('Product attached as primary');

  // 6. Publish
  await setStatus({ contentId, status: 'published' });
  console.log('Content published');

  // 7. Log final URL
  const publicUrl = `/review/${slug}`;
  console.log(`\nSeeded review page ready at: ${publicUrl}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
