import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const OFFICIAL_BRAND_IMAGE_URL =
  'https://i.ibb.co/RGhd9Wx5/file-000000001ce881fabba7c0cb6405b5e3.png';
export const OFFICIAL_SIGNATURE_IMAGE_URL =
  'https://i.ibb.co/4gThRdST/1000484283-removebg-preview.png';

const imageDataUrlCache: Record<string, string> = {};

/**
 * Fetches an external image and converts it into a Base64 Data URL so html2canvas & jsPDF
 * never encounter CORS tainting on mobile or desktop browsers.
 */
export async function toSafeDataUrl(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) return url;
  if (imageDataUrlCache[url]) return imageDataUrlCache[url];

  try {
    const response = await fetch(url, { mode: 'cors', cache: 'force-cache' });
    if (!response.ok) return url;
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = typeof reader.result === 'string' ? reader.result : url;
        imageDataUrlCache[url] = result;
        resolve(result);
      };
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

/**
 * Exports an HTML element directly to a downloadable PDF document (.pdf) without ever
 * opening window.print(). Automatically normalizes layout width so mobile phone users
 * receive a crisp, full-proportioned A4 PDF document.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string,
  orientation: 'p' | 'l' = 'p'
): Promise<void> {
  const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  // Create an off-screen A4-proportioned clone so mobile screens (360px) still export full-width A4 PDFs
  const targetWidthPx = orientation === 'p' ? 820 : 1040;
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '-10000px';
  wrapper.style.left = '-10000px';
  wrapper.style.width = `${targetWidthPx}px`;
  wrapper.style.zIndex = '-9999';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.background = '#ffffff';

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${targetWidthPx}px`;
  clone.style.maxWidth = `${targetWidthPx}px`;
  clone.style.margin = '0';
  clone.style.overflow = 'visible';

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // Convert all <img> tags inside the clone to Base64 Data URLs for 100% CORS-free PDF embedding
    const imgElements = Array.from(clone.querySelectorAll('img'));
    await Promise.all(
      imgElements.map(async (img) => {
        const src = img.getAttribute('src') || '';
        if (src && !src.startsWith('data:')) {
          img.setAttribute('crossorigin', 'anonymous');
          const dataUrl = await toSafeDataUrl(src);
          img.src = dataUrl;
        }
        // Wait for image decoding
        if (!img.complete) {
          await new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
            setTimeout(res, 1500);
          });
        }
      })
    );

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      width: targetWidthPx,
      windowWidth: targetWidthPx
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    const pdf = new jsPDF({
      orientation: orientation === 'p' ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = orientation === 'p' ? 210 : 297;
    const pageHeight = orientation === 'p' ? 297 : 210;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight + 4) {
      // Fit cleanly onto a single A4 page
      const finalHeight = Math.min(imgHeight, pageHeight);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, finalHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 2) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    pdf.save(safeFileName);
  } catch (error) {
    console.error('Canvas PDF capture fallback triggered:', error);
    // Pure vector jsPDF fallback — NEVER calls window.print()
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    pdf.setFillColor(7, 11, 20);
    pdf.rect(0, 0, 210, 32, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.text('AFFY OFFICIAL - VERIFIED DOCUMENT', 14, 16);
    pdf.setFontSize(10);
    pdf.text(`Document: ${safeFileName.replace('.pdf', '')}`, 14, 24);
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(11);
    const plainText = (element.innerText || '').split('\n').filter(Boolean);
    let y = 45;
    for (const line of plainText.slice(0, 45)) {
      const wrapped = pdf.splitTextToSize(line, 180);
      pdf.text(wrapped, 14, y);
      y += wrapped.length * 5.5;
      if (y > 280) break;
    }
    pdf.save(safeFileName);
  } finally {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}
