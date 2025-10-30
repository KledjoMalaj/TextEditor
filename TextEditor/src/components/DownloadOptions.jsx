import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

function DownloadOptions({onClose,title}){

    const handleDownloadPdf = () => {
        const editorElement = document.querySelector('.Editor');

        if (!editorElement) {
            alert('No content to download');
            return;
        }

        html2canvas(editorElement).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = 210;
            const pageHeight = 297;
            const margins = 20;
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pageWidth - margins * 2;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', margins, margins, pdfWidth, pdfHeight);
            pdf.save(`${title}.pdf`);

            onClose();
        }).catch(error => {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
            onClose();
        });
    }

    return(
        <>
            <div className="fixed  left-35  border rounded-lg bg-white shadow-2xl z-50">
                <div className={'m-2'}>
                    <button className={'hover:bg-gray-200 p-2 rounded cursor-pointer'} onClick={handleDownloadPdf}>Download as PDF</button><br></br>
                </div>
            </div>
        </>
    )
}
export default DownloadOptions