export default function ProductReviews() {
  return (
    <div className="mt-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        <div className="border-b pb-4">
          <div className="flex items-center mb-2">
            <span className="font-semibold">John Doe</span>
            <span className="ml-2 text-yellow-500">★★★★★</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Great quality! Highly recommend this product.
          </p>
        </div>
        <div className="border-b pb-4">
          <div className="flex items-center mb-2">
            <span className="font-semibold">Jane Smith</span>
            <span className="ml-2 text-yellow-500">★★★★☆</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Good product, fast delivery. Will buy again!
          </p>
        </div>
      </div>
    </div>
  );
}