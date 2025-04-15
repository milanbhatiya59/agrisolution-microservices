import sampleSoilCard from "../assets/sample-soilcard.jpeg";

const DownloadSampleSoilCardButton = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = sampleSoilCard;
    link.download = "Sample-Soil-Health-Card.jpeg"; // Corrected extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
    >
      📄 Download Sample Soil Card
    </button>
  );
};

export default DownloadSampleSoilCardButton;
