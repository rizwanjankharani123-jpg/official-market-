import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Exports an HTML element directly to a downloadable PDF document.
 * Preserves high-DPI rasterization, styles, typography, and images.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string,
  orientation: 'p' | 'l' = 'p'
): Promise<void> {
  try {
    // Generate high-resolution canvas capture
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: orientation === 'p' ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = orientation === 'p' ? 210 : 297;
    const pageHeight = orientation === 'p' ? 297 : 210;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      // Single page document
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page document
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF document:', error);
    // Fallback to native print if canvas fails
    window.print();
  }
}
