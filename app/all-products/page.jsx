// 'use client'

// import ProductCard from "@/components/ProductCard";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { useAppContext } from "@/context/AppContext";

// const AllProducts = () => {

//     const { products } = useAppContext();

//     return (
//         <>
//             <Navbar />
//             <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
//                 <div className="flex flex-col items-end pt-12">
//                     <p className="text-2xl font-medium">All products</p>
//                     <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
//                 </div>
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
//                     {products.map((product, index) => <ProductCard key={index} product={product} />)}
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default AllProducts;
'use client'
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/Products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {loading ? (
          <p className="mt-10 text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
            {products.map((product, index) => (
              <ProductCard key={product._id || index} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
