import { collection, addDoc } from "firebase/firestore";

// inside the if (status === "success") block:
await updateDoc(userRef, {
  coins: oldCoins + metadata.coinsToAdd,
});

// 🔹 Save transaction record
await addDoc(collection(db, "users", metadata.uid, "transactions"), {
  amount: response.data.data.amount,
  coins: metadata.coinsToAdd,
  status: "success",
  reference: response.data.data.reference,
  date: new Date().toISOString(),
});
