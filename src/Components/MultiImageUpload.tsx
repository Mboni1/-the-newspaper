import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface MultiImageUploadProps {
  existingImages?: string[]; // amafoto asanzwe (editing)
  onChange: (files: File[], removedExisting?: string[]) => void;
  // files = amafoto mashya
  // removedExisting = amafoto asanzwe yakuwemo
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  existingImages = [],
  onChange,
}) => {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removedExisting, setRemovedExisting] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // previews = existing images minus removed + new files
    const existing = existingImages.filter(
      (img) => !removedExisting.includes(img)
    );
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...existing, ...newPreviews]);
    onChange(newFiles, removedExisting);
  }, [newFiles, removedExisting, existingImages]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setNewFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    const existingCount = existingImages.length - removedExisting.length;
    if (index < existingCount) {
      // remove existing image
      const img = previews[index];
      setRemovedExisting((prev) => [...prev, img]);
    } else {
      // remove new file
      const fileIndex = index - existingCount;
      setNewFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setCurrentIndex(0);
  };

  if (previews.length === 0)
    return (
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        className="border border-gray-300 rounded-xl p-2"
      />
    );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <img
          src={previews[currentIndex]}
          alt={`preview-${currentIndex}`}
          className="w-full h-full object-cover"
        />

        {/* Carousel Buttons */}
        {previews.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + previews.length) % previews.length
                )
              }
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % previews.length)
              }
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow hover:bg-gray-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Remove Button */}
        <button
          onClick={() => removeImage(currentIndex)}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Input to select more images */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFilesChange}
        className="border border-gray-300 rounded-xl p-2"
      />

      {/* Thumbnails */}
      {previews.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {previews.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              className={`h-16 w-16 object-cover rounded-lg cursor-pointer border-2 ${
                idx === currentIndex ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
