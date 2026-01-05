// 'use client'
// // import { productsDummyData, userDummyData } from "@/assets/assets";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { createContext, useContext, useEffect, useState } from "react";

// export const AppContext = createContext();

// export const useAppContext = () => {
//     return useContext(AppContext)
// }

// export const AppContextProvider = (props) => {

//     const currency = process.env.NEXT_PUBLIC_CURRENCY
//     const router = useRouter()

//    const {user} = useUser()


//     const [products, setProducts] = useState([])
//     const [userData, setUserData] = useState(false)
//     const [isSeller, setIsSeller] = useState(true)
//     const [cartItems, setCartItems] = useState({})

//     const fetchProductData = async () => {
//         setProducts(productsDummyData)
//     }

//     const fetchUserData = async () => {
//         setUserData(userDummyData)
//     }

//   const addToCart = async (itemId) => {
//   const id = itemId.toString(); // ✅ make sure always string
//   let cartData = structuredClone(cartItems);

//   if (cartData[id]) {
//     cartData[id] += 1;
//   } else {
//     cartData[id] = 1;
//   }

//   setCartItems(cartData);
// };

// const updateCartQuantity = async (itemId, quantity) => {
//   const id = itemId.toString(); // ✅ keep consistent
//   let cartData = structuredClone(cartItems);

//   if (quantity === 0) {
//     delete cartData[id];
//   } else {
//     cartData[id] = quantity;
//   }

//   setCartItems(cartData);
// };

//     const getCartCount = () => {
//         let totalCount = 0;
//         for (const items in cartItems) {
//             if (cartItems[items] > 0) {
//                 totalCount += cartItems[items];
//             }
//         }
//         return totalCount;
//     }

//   const getCartAmount = () => {
//     let totalAmount = 0;
//     for (const items in cartItems) {
//         const itemInfo = products.find((product) => product._id === items);
//         if (!itemInfo) continue; // Skip if product not found
//         if (cartItems[items] > 0) {
//             totalAmount += itemInfo.offerPrice * cartItems[items];
//         }
//     }
//     return Math.floor(totalAmount * 100) / 100;
// }


//     useEffect(() => {
//         fetchProductData()
//     }, [])

//     useEffect(() => {
//         fetchUserData()
//     }, [])

//     const value = {
//         user,
//         currency, router,
//         isSeller, setIsSeller,
//         userData, fetchUserData,
//         products, fetchProductData,
//         cartItems, setCartItems,
//         addToCart, updateCartQuantity,
//         getCartCount, getCartAmount
//     }

//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }


'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "₹";
  const router = useRouter();
  const { user } = useUser();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(true);
  const [cartItems, setCartItems] = useState({});

  // ✅ Fetch products from your backend API
const fetchProductData = async () => {
  try {
    const res = await fetch("/api/Products");
    const data = await res.json();

    // If the API returns an array directly
    if (Array.isArray(data)) {
      setProducts(data);
    } else if (data.success && data.products) {
      setProducts(data.products);
    } else {
      console.error("❌ Failed to load products:", data.message || data);
    }
  } catch (error) {
    console.error("⚠️ Error fetching products:", error);
  }
};


  // ✅ Get user data from Clerk (or your backend)
  const fetchUserData = async () => {
    try {
      if (!user) return;
      setUserData({
        name: user.fullName || "Guest",
        email: user.emailAddresses?.[0]?.emailAddress || "no-email",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 🛒 Add item to cart
  const addToCart = async (itemId) => {
    const id = itemId.toString();
    const cartData = structuredClone(cartItems);

    if (cartData[id]) cartData[id] += 1;
    else cartData[id] = 1;

    setCartItems(cartData);
  };

  // 🔁 Update cart quantity
  const updateCartQuantity = async (itemId, quantity) => {
    const id = itemId.toString();
    const cartData = structuredClone(cartItems);

    if (quantity === 0) delete cartData[id];
    else cartData[id] = quantity;

    setCartItems(cartData);
  };

  // 🧮 Get total items in cart
  const getCartCount = () => {
    let totalCount = 0;
    for (const id in cartItems) {
      if (cartItems[id] > 0) totalCount += cartItems[id];
    }
    return totalCount;
  };

  // 💰 Calculate total price
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const itemInfo = products.find((p) => p._id === id);
      if (!itemInfo) continue;
      totalAmount += itemInfo.offerPrice * cartItems[id];
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const value = {
    user,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
