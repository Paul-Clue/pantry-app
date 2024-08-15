'use client';
// import { signIn, signOut, useSession } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Container from '@mui/material/Container';
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import { Camera } from 'react-camera-pro';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 500,
  overflow: 'auto',
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

  const camera = useRef<typeof Camera>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [faceMode, setFaceMode] = useState<'user' | 'environment'>(
    'environment'
  );
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<
    { name: string; quantity: number }[]
  >([]);
  const [open, setOpen] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>('');

  const toggleFacingMode = () => {
    if (camera.current && 'switchCamera' in camera.current) {
      (camera.current as any).switchCamera();
      setFaceMode((prevMode: string) =>
        prevMode === 'user' ? 'environment' : 'user'
      );
    }
  };

  const takePhoto = () => {
    if (camera.current && 'takePhoto' in camera.current) {
      const photo = (camera.current as any).takePhoto();
      // setLoading(true);
      // Convert the photo to base64
      fetch(photo)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Image = reader.result as string;
            setImage(base64Image);
            // sendImageToOpenAI(base64Image);
            await sendImageToOpenAI(base64Image);
            // setLoading(false);
          };
          reader.readAsDataURL(blob);
        });
    }
  };

  const sendImageToOpenAI = async (base64Image: string) => {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error('Failed to get image description');
      }

      const data = await response.json();
      setImageDescription(data.description);
    } catch (error) {
      console.error('Error getting image description:', error);
      setImageDescription('Failed to get image description');
    }
  };

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
      // console.log('data', data);
      // console.log('inventoryList', data.inventoryList);
      // console.log('beans', data.inventoryList[0]);
      // console.log('numberOfBeans', data.inventoryList[0].data.quantity);
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
    }
  };

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

  useEffect(() => {
    updateInventory();
  }, [updateInventory]);

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
          <>
            <Box sx={style}>
              {/* <Container
                component='main'
                className='border-2 border-green-500 h-full w-full flex flex-col items-center justify-center p-0'
              > */}
              <Box className='border-2 border-green-500 w-full flex flex-col items-center justify-center'>
                <Box
                  sx={{
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid green',
                    // borderRadius: '15px',
                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
                    backgroundColor: 'black',
                    width: '100%',
                    height: '80%',
                  }}
                >
                  {isCameraOn ? (
                    <Box
                      style={{
                        display: 'flex',
                        // width: '300px',
                        width: '100%',
                        height: '57%',
                        flexDirection: 'row',
                        alignItems: 'start',
                        // border: '1px solid orange',
                        // borderRadius: '15px'
                      }}
                    >
                      {/* <Button
                          variant='contained'
                          sx={{
                            color: 'green',
                            backgroundColor: 'green',
                            marginBottom: '10px',
                            marginTop: '10px',
                          }}
                          onClick={toggleFacingMode}
                        >
                          <CameraswitchIcon sx={{ color: 'whitesmoke' }} />
                        </Button> */}
                      {/* <Box sx={{
                            color: 'green',
                            backgroundColor: 'green',
                            marginBottom: '10px',
                            marginTop: '10px',
                            width: '25px'
                          }}></Box> */}
                      {loading && (
                        <CircularProgress
                          size={80}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1000,
                          }}
                        />
                      )}
                      <Camera
                        ref={camera}
                        aspectRatio={16 / 6}
                        errorMessages={{
                          noCameraAccessible: 'No camera device accessible',
                          permissionDenied: 'Permission denied',
                          switchCamera: 'Could not switch camera',
                          canvas: 'Canvas error',
                        }}
                      />
                      <Box
                        style={{
                          width: '100%',
                          // height: '100%',
                          border: '1px solid green',
                          // marginTop: '2px',
                          // padding: '20px',
                          overflow: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        {image && (
                          <Box>
                            <Image
                              src={image}
                              width={200}
                              height={150}
                              style={{ margin: 'auto' }}
                              alt='Taken photo'
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box
                        className='camera-placeholder'
                        style={{
                          color: 'whitesmoke',
                          width: '150px',
                          textAlign: 'center',
                        }}
                      >
                        Camera is off
                      </Box>
                    </>
                  )}
                  {imageDescription && (
                    <Box>
                      <Typography variant='body1' sx={{ mt: 2 }}>
                        Description: {imageDescription}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
                >
                  <Button
                    variant='contained'
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    style={{ marginBottom: '10px', width: '200px' }}
                  >
                    {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                  </Button>
                  {isCameraOn && (
                    <Box>
                      <Button
                        variant='contained'
                        style={{ width: '200px' }}
                        onClick={takePhoto}
                        disabled={loading}
                      >
                        Take photo
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
              {/* </Container> */}
              {/* <Box sx={style}> */}
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
          </>
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
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </>
  );
}

Pantry.requireAuth = true;
