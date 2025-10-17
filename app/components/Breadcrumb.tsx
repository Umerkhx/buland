import Link from "next/link";

interface BreadcrumbProps {
  categoryName?: string;
  productName?: string;
}

export default function Breadcrumb({ categoryName, productName }: BreadcrumbProps) {

  return (
    <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
      <Link href={'/'} className="cursor-pointer hover:text-blue-600">
        Home
      </Link>
      {" / "}
      <Link href={"/categories"} className="cursor-pointer hover:text-blue-600" >
        Categories
      </Link>
      {categoryName && (
        <>
          {" / "}
          <span className={`${productName ? "cursor-pointer hover:text-blue-600" : "font-semibold text-gray-800 dark:text-gray-200"}`}>
            {categoryName}
          </span>
        </>
      )}
      {productName && (
        <>
          {" / "}
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {productName}
          </span>
        </>
      )}
    </div>
  );
}