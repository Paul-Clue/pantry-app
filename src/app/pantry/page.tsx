'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from '@mui/material';
import { firestore } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Pantry() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const [inventory, setInventory] = useState<{ name: string; data: any }[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>('');

  const updateInventory = useCallback(async () => {
    try {
      const response = await fetch('/api/updateInventory', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(),
      });

      if (!response.ok) {
        throw new Error('Failed to get inventory items');
      }

      const data = await response.json();
      console.log('data', data);
      console.log('inventoryList', data.inventoryList);
      console.log('beans', data.inventoryList[0]);
      console.log('numberOfBeans', data.inventoryList[0].data.quantity);
      // await updateInventory();
      const inventoryList: { name: string; data: any }[] = [];
      //   docs.forEach((doc) => {
      //     inventoryList.push({ name: doc.id, data: doc.data() });
      //   });
      // setInventory(inventoryList);
      //   console.log(inventoryList)
      // setImageDescription(data.description);
    } catch (error) {
      console.error('Error getting items description:', error);
      // setImageDescription('Failed to get items');
    }
  }, []);

  const addItem = async (item: string) => {
    try {
      const response = await fetch('/api/updateInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item }),
      });

      if (!response.ok) {
        throw new Error('Failed to get inventory items');
      }

      const data = await response.json();
      // console.log('data', data)
      // setImageDescription(data.description);
    } catch (error) {
      console.error('Error getting items description:', error);
      // setImageDescription('Failed to get items');
    }
  };
  addItem('beans');
  addItem('corn');

  const removeItem = async (item: string) => {
    try {
      const response = await fetch('/api/removeItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item }),
      });

      if (!response.ok) {
        throw new Error('Failed to handle your request');
      }

      if (response.status === 200) {
        console.log('Item removed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // removeItem('beans');

  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

  // const updateInventory = async () => {
  //   const snapshot = query(collection(firestore, 'inventory'));
  //   const docs = await getDocs(snapshot);
  //   const inventoryList: { name: string; data: any }[] = [];
  //   docs.forEach((doc) => {
  //     inventoryList.push({ name: doc.id, data: doc.data() });
  //   });
  //   setInventory(inventoryList);
  // };

  // const addItem = async (item: string) => {
  //   const docRef = doc(collection(firestore, 'inventory'), item);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const { quantity } = docSnap.data();
  //     await setDoc(docRef, { quantity: quantity + 1 });
  //   } else {
  //     await setDoc(docRef, { quantity: 1 });
  //   }
  //   await updateInventory();
  // };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box>
        <Typography variant='h1'>Inventory Management</Typography>
      </Box>
      <h1>Pantry</h1>
      <p>Welcome {session?.data?.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  );
}

Pantry.requireAuth = true;
