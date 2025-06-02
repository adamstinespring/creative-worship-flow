import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/useToast';

export default function PlanViewer({ plan }) {
  const componentRef = useRef();
  const { showToast } = useToast();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePDF = async () => {
    try {
      const element = componentRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${plan.theme.replace(/\s+/g, '_')}_service_plan.pdf`);
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      showToast('Error generating PDF', 'error');
    }
  };

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <button onClick={handlePrint} className="btn-primary">
          Print Plan
        </button>
        <button onClick={handlePDF} className="btn-secondary">
          Download PDF
        </button>
      </div>
      <div ref={componentRef} className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Service Plan: {plan.theme}</h1>
        <div className="whitespace-pre-wrap">{plan.service_plan}</div>
      </div>
    </div>
  );
}
