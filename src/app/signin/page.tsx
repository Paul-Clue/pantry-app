'use client';
import * as React from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Signin(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setErrorMessage("The email or password you entered is incorrect.");
    } else {
      router.push('/pantry');
    }
  };


  return (
    <ThemeProvider theme={createTheme()}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'whitesmoke',
            padding: '5px',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'rgb(46, 118, 210)' }}>
            <LockOutlinedIcon />
          </Avatar>
          {errorMessage && (
            <Typography color='error' sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <Typography
            component='h1'
            variant='h5'
            sx={{ color: 'rgb(115, 115, 115)' }}
          >
            Sign in
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              autoComplete='email'
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='current-password'
            />
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
              sx={{ color: 'rgb(115, 115, 115)' }}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              // onClick={() =>
              //   signIn('credentials', {
              //     email,
              //     password,
              //     redirect: true,
              //     callbackUrl: '/',
              //   }).then((result) => {
              //     if (result?.error) {
              //       console.error(result.error);
              //     } else {
              //       // Redirect manually after successful sign-in
              //       window.location.href = '/uploadPic';
              //     }
              //   })
              // }
              disabled={!email || !password}
              className='disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='/forgotPassword' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/signup' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
};
