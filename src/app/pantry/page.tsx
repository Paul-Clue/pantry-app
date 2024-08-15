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

  const [inventory, setInventory] = useState<
    { name: string; quantity: number }[]
  >([]);
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
      const inventoryListing: { name: string; quantity: any }[] = [];
      data.inventoryList.forEach((item: { name: string; data: any }) => {
        inventoryListing.push({
          name: item.name,
          quantity: item.data.quantity,
        });
      });
      setInventory(inventoryListing);
      console.log('inventoryListing', inventoryListing);
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
      await updateInventory();
    } catch (error) {
      console.error('Error getting items description:', error);
      // setImageDescription('Failed to get items');
    }
  };
  // addItem('beans');
  // addItem('corn');

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
        await updateInventory();
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
      <Box
        width='100vw'
        height='100vh'
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Add Item
            </Typography>
            <Stack width='100%' direction={'row'} spacing={2}>
              <TextField
                id='outlined-basic'
                label='Item'
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant='outlined'
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant='contained' onClick={handleOpen}>
          Add New Item
        </Button>
        <Box border={'1px solid #333'}>
          <Box
            width='800px'
            height='100px'
            bgcolor={'#ADD8E6'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width='800px' height='300px' spacing={2} overflow={'auto'}>
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width='100%'
                minHeight='150px'
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Button variant='contained' onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant='contained' onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
      {/* <Box>
        <Typography variant='h1'>Inventory Management</Typography>
      </Box>
      <h1>Pantry</h1>
      <p>Welcome {session?.data?.user?.email}</p> */}
      <button onClick={() => signOut()}>Sign out</button>
    </>
  );
}

Pantry.requireAuth = true;
