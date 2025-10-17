import { useState } from "react";

interface ProductImagesProps {
  images: string | string[];
  productName: string;
}

export default function ProductImages({ images, productName }: ProductImagesProps) {
  const imageArray = Array.isArray(images) ? images : [images];
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
      <img
        src={imageArray[selectedImage]}
        alt={productName}
        className="w-full h-[500px] object-cover rounded-lg mb-4"
      />
      {imageArray.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {imageArray.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${productName} ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                selectedImage === index
                  ? "border-blue-600"
                  : "border-transparent hover:border-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}