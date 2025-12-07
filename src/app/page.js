'use client';



import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';

import FormControlLabel from '@mui/material/FormControlLabel';

import Checkbox from '@mui/material/Checkbox';


import Container from '@mui/material/Container';

import Box from '@mui/material/Box';



export default function Home() {

  // main submit handler for the login form
  const handleSubmit = (event) => {

    console.log("handling submit"); // quick log to see that submit fired

    event.preventDefault(); // stop page reload so React can handle things

    const data = new FormData(event.currentTarget); // grab all form values from the form element



    let email = data.get('email') // read the email text field
    let pass = data.get('pass')   // read the password text field


    console.log("Sent email:" + email) // debug log to check what email was typed
    console.log("Sent pass:" + pass)   // debug log to check what password was typed



    // call the backend login api with query params for email and pass
    runDBCallAsync(`http://localhost:3000/api/login?email=${email}&pass=${pass}`)

 };


  // async helper that actually talks to the server
  async function runDBCallAsync(url) {

    const res = await fetch(url); // send request to the login api
    const data = await res.json(); // turn the response body into a JS object


    if(data.data== "valid"){
      console.log("login is valid!")

      window.location = "/dashboard" // redirect to dashboard if login is ok

    } else {

      console.log("not valid  ")

    }

  }



  return (

    <Container maxWidth="sm">

    <Box sx={{ height: '100vh' }} >


    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

    <TextField

      margin="normal"

      required

      fullWidth

      id="email"

      label="Email Address"

      name="email"

      autoComplete="email"

      autoFocus

    />

    <TextField

      margin="normal"

      required

      fullWidth

      name="pass"

      label="Pass"

      type="password"

      id="pass"

      autoComplete="current-password"

    />

    <FormControlLabel

      control={<Checkbox value="remember" color="primary" />}

      label="Remember me"

    />

    <Button

      type="submit"

      fullWidth

      variant="contained"

      sx={{ mt: 3, mb: 2 }}

    >

      Sign In

    </Button>

</Box>

</Box>

       </Container>

  );
}
