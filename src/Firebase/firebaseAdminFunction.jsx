import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addFood = async (
  name,
  description,
  image_link,
  price,
  category
) => {
  try {
    const foodRef = collection(db, "foods");

    const newFood = {
      name,
      description,
      imageUrl: image_link,
      price: parseFloat(price),
      category,
      bestseller: false,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(foodRef, newFood);
    return docRef.id;
  } catch (error) {
    console.error("Error adding food item:", error);
    throw error;
  }
};

export const getAllFood = async () => {
  try {
    const foodRef = collection(db, "foods");
    const snapshot = await getDocs(foodRef);
    const foodList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return foodList;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteTheFood = async ({ id }) => {
  try {
    const foodRef = doc(db, "foods", id);
    await deleteDoc(foodRef);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addToBestSeller = async ({ id }) => {
  try {
    const foodRef = doc(db, "foods", id);
    await updateDoc(foodRef, {
      bestseller: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeFromBestSeller = async ({ id }) => {
  try {
    const foodRef = doc(db, "foods", id);
    await updateDoc(foodRef, {
      bestseller: false,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const orderRef = collection(db, "orders");
    const snapshot = await getDocs(orderRef);
    const OrderItem = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return OrderItem;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateOrderStatus = async ({ id, text }) => {
  try {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, {
      status: text,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
