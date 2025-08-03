import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addToCart = async ({
  usserId,
  userName,
  userEmail,
  foodId,
  FoodName,
  FoodPrice,
  FoodImageUrl,
  FoodDescription,
}) => {
  try {
    const cartRef = collection(db, "cart");
    const q = query(cartRef, where("userId", "==", usserId));
    const snapshot = await getDocs(q);

    const newFoodItem = {
      foodId,
      FoodName,
      FoodPrice,
      FoodImageUrl,
      FoodDescription,
      quantity: 1,
    };

    if (!snapshot.empty) {
      const cartDoc = snapshot.docs[0];
      const cartData = cartDoc.data();
      const cartItems = cartData.cartItems || [];

      const existingIndex = cartItems.findIndex(
        (item) => item.foodId === foodId
      );

      if (existingIndex !== -1) {
        cartItems[existingIndex].quantity += 1;
      } else {
        cartItems.push(newFoodItem);
      }

      await updateDoc(doc(db, "cart", cartDoc.id), {
        cartItems,
      });
    } else {
      await addDoc(cartRef, {
        userId: usserId,
        userName,
        userEmail,
        cartItems: [newFoodItem],
      });
    }
  } catch (error) {
    console.error("Error in addToCart:", error);
    throw error;
  }
};

export const removeFromCart = async ({ userId, foodId }) => {
  try {
    const cartRef = collection(db, "cart");
    const q = query(cartRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    const cartDoc = snapshot.docs[0];
    const cartData = cartDoc.data();
    const cartItems = cartData.cartItems || [];

    const updatedCartItems = cartItems.filter((item) => item.foodId !== foodId);

    if (updatedCartItems.length === 0) {
      await deleteDoc(doc(db, "cart", cartDoc.id));
    } else {
      await updateDoc(doc(db, "cart", cartDoc.id), {
        cartItems: updatedCartItems,
      });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async ({
  userId,
  foodId,
  newQuantity,
}) => {
  try {
    const cartRef = collection(db, "cart");
    const q = query(cartRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return;
    }

    const cartDoc = snapshot.docs[0];
    const cartData = cartDoc.data();
    const cartItems = cartData.cartItems || [];

    const updatedCartItems = cartItems.map((item) => {
      if (item.foodId === foodId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    await updateDoc(doc(db, "cart", cartDoc.id), {
      cartItems: updatedCartItems,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

export const getCartItem = async (userid) => {
  try {
    const cartRef = collection(db, "cart");
    const q = query(cartRef, where("userId", "==", userid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return items;
  } catch (error) {
    console.error("Error getting cart items:", error);
    throw error;
  }
};

export const getMenu = async () => {
  try {
    const foodRef = collection(db, "foods");
    const snapshot = await getDocs(foodRef);
    const Items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return Items;
  } catch (error) {
    console.error("Error fetching bestseller menu:", error);
    throw error;
  }
};

export const getBestSellerMenu = async () => {
  try {
    const foodRef = collection(db, "foods");
    const q = query(foodRef, where("bestseller", "==", true));
    const snapshot = await getDocs(q);
    const bestsellerItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return bestsellerItems;
  } catch (error) {
    console.error("Error fetching bestseller menu:", error);
    throw error;
  }
};

export const createOrder = async ({ data, cartId }) => {
  try {
    const orderRef = collection(db, "orders");
    await addDoc(orderRef, data);
    const cartRef = doc(db, "cart", cartId);
    await deleteDoc(cartRef);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMyOrder = async (userId) => {
  try {
    const orderRef = collection(db, "orders");
    const q = query(orderRef, where("userInfo.userId", "==", `${userId}`));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return list;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
