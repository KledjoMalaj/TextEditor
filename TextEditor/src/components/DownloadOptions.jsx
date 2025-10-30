import jsPDF from "jspdf";

function DownloadOptions({onClose,title}){

    const handleDownloadPdf = () => {
        const editorElement = document.querySelector('.Editor');

        if (!editorElement) {
            alert('No content to download');
            return;
        }

        try {
            const textContent = editorElement.innerText || editorElement.textContent;

            if (!textContent.trim()) {
                alert('Document is empty');
                return;
            }
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            pdf.setFontSize(12);

            const pageWidth = 210;
            const margins = 20;
            const maxWidth = pageWidth - (margins * 2);

            const lines = pdf.splitTextToSize(textContent, maxWidth);

            pdf.text(lines, margins, margins);

            pdf.save(`${title}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF');
        }
        onClose()
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