import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../src/app/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList: { name: string; data: any }[] = [];
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, data: doc.data() });
      });
      // setInventory(inventoryList);
      // console.log(inventoryList)

      res.status(200).json({ inventoryList });
    } catch (error) {
      console.error('Error processing request:', error);

      res.status(500).json({ error: error });
    }
  } else if (req.method === 'POST') {
    const { reqItem } = req.body;
    const item = reqItem.charAt(0).toUpperCase()
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }

      // await updateInventory();
      //   setInventory(inventoryList);
      //   console.log(inventoryList)

      // res.status(200).json({ inventoryList });
      res.status(200).json({});
    } catch (error) {
      console.error('Error processing request:', error);

      res.status(500).json({ error: error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
