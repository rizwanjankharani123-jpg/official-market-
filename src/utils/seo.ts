import { Product } from '../types';

/**
 * Technical SEO & OpenGraph Helper for AFFY OFFICIAL
 */
export function updatePageSEO(view: string, product?: Product | null) {
  const baseTitle = 'AFFY OFFICIAL — Aftab | Web Developer & Software Developer';
  let title = baseTitle;
  let description =
    'Official software & source code marketplace and portfolio of Aftab (CodeWithAffy). Download verified Android APKs, purchase commercial source code, and commission custom software.';
  let ogImage = 'https://i.ibb.co/rR2WdxJ0/1772950442657-1.jpg';

  if (product) {
    title = `${product.name} — AFFY OFFICIAL | Software & Source Code`;
    description = product.shortDescription || description;
    if (product.demoImages && product.demoImages.length > 0) {
      ogImage = product.demoImages[0];
    }
  } else {
    switch (view) {
      case 'featured':
        title = 'Featured Products & Software Releases — AFFY OFFICIAL (CodeWithAffy)';
        description =
          'Discover featured apps, flagship software releases, and top curated digital products developed by Aftab.';
        break;
      case 'new-releases':
        title = 'New Software Releases & Latest Builds — AFFY OFFICIAL (CodeWithAffy)';
        description =
          'Explore the newest software, fresh mobile APK releases, and latest source code drops engineered by Aftab.';
        break;
      case 'software':
        title = 'Software & Verified APK Marketplace — AFFY OFFICIAL (CodeWithAffy)';
        description =
          'Browse and download production-ready Android APKs, retail Point of Sale systems, streaming players, and software applications built by Aftab.';
        break;
      case 'free':
      case 'free-apps':
        title = 'Free Apps & Free Software Downloads — AFFY OFFICIAL (CodeWithAffy)';
        description =
          'Download 100% free verified Android APKs, open utilities, and desktop software built by Aftab with instant direct access.';
        break;
      case 'source-code':
        title = 'Commercial Source Code Marketplace — AFFY OFFICIAL (CodeWithAffy)';
        description =
          'Acquire commercial source code licenses for full-stack systems, Kotlin apps, React engines, and backend APIs with complete documentation and support.';
        break;
      case 'about':
        title = 'About Aftab — Web Developer & Software Developer | AFFY OFFICIAL';
        description =
          'Learn about Aftab, lead engineer at CodeWithAffy / AFFY OFFICIAL. View core skills, development philosophy, verified contacts, and software delivery standards.';
        break;
      case 'announcements':
      case 'news':
        title = 'Official Bulletins & Developer News — AFFY OFFICIAL';
        description =
          'Latest product announcements, version changelogs, promotional deals, and software updates from Aftab.';
        break;
      case 'request-software':
      case 'request':
        title = 'Request Custom Software or Features — AFFY OFFICIAL';
        description =
          'Submit your software idea, feature request, or custom app build requirements directly to Aftab.';
        break;
      case 'deals':
      case 'offers':
        title = 'Personalized Deals & Loyalty Perks — AFFY OFFICIAL';
        description =
          'Exclusive customer discounts and targeted savings on commercial software and source code.';
        break;
      case 'campaigns':
      case 'events':
        title = 'Promotional Campaigns & Seasonal Events — AFFY OFFICIAL';
        description =
          'Participate in seasonal marketplace events, developer festivals, and limited-time software sales.';
        break;
      case 'giveaways':
      case 'winners':
        title = 'Official Software Giveaways & Winners Archive — AFFY OFFICIAL';
        description =
          'Transparent verified archive of software license giveaway winners and active entry events.';
        break;
      case 'custom-project':
        title = 'Request Custom Software Development — Aftab | AFFY OFFICIAL';
        description =
          'Commission custom web platforms, mobile APKs, cloud backends, and bespoke enterprise solutions directly from Aftab with transparent milestones.';
        break;
      case 'track-order':
        title = 'Order Tracking & Secure Download Vault — AFFY OFFICIAL';
        description =
          'Track your software order status, check manual payment verification progress, access secure download links, and export official commercial invoices.';
        break;
      case 'terms':
        title = 'Terms of Service, Licensing & Policies — AFFY OFFICIAL';
        description =
          'Official commercial licensing terms, source code redistribution rules, manual payment audit verification procedures, and digital delivery policies.';
        break;
      case 'contact':
        title = 'Official Contact Channels — Aftab | AFFY OFFICIAL';
        description =
          'Official verified contact methods for Aftab: Direct WhatsApp (+92 326 3724861), WhatsApp Channel, and official Gmail.';
        break;
      default:
        title = baseTitle;
    }
  }

  // Update browser document title
  document.title = title;

  // Update or create meta tags
  const setMeta = (name: string, content: string, property: boolean = false) => {
    const attr = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let element = document.querySelector(attr);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(property ? 'property' : 'name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  setMeta('description', description);
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:image', ogImage, true);
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', ogImage);

  // Update Product Structured Data if product is selected
  let productScript = document.getElementById('product-schema');
  if (product) {
    if (!productScript) {
      productScript = document.createElement('script');
      productScript.id = 'product-schema';
      productScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(productScript);
    }
    productScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: product.name,
      operatingSystem: 'Android, Windows, Linux, Web',
      applicationCategory: 'BusinessApplication',
      description: product.shortDescription,
      offers: {
        '@type': 'Offer',
        price: (product.pricingType === 'free' || product.price === 0) ? '0' : product.price.toString(),
        priceCurrency: 'PKR',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2030-12-31'
      },
      author: {
        '@type': 'Person',
        name: 'Aftab',
        jobTitle: 'Web Developer & Software Developer'
      }
    });
  } else if (productScript) {
    productScript.remove();
  }
}
