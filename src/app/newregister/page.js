'use client';


import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

export default function Home() {

    // main submit handler for the register form
    const handleSubmit = (event) => {
        console.log("handling submit");
        // stop the page from reloading on form submit
        event.preventDefault();

        // grab all the form values
        const data = new FormData(event.currentTarget);

        // pull out each field from the form data
        let email = data.get('email');
        let pass = data.get('pass');
        let address = data.get('address');
        let phone = data.get('phone');
        let confirmEmail = data.get('confirm-email');
        let confirmPass = data.get('confirm-pass');

        console.log("Sent email:" + email);
        console.log("Sent pass:" + pass);
        console.log("Sent address:" + address);
        console.log("Sent phone:" + phone);
        console.log("Sent confirm password:" + confirmPass);
        console.log("Sent confirm email:" + confirmEmail);

        // call the backend api
        runDBCallAsync(
            `http://localhost:3000/api/newregister?email=${email}&pass=${pass}&address=${address}&phone=${phone}&confirmEmail=${confirmEmail}&confirmPass=${confirmPass}`
        );
    };

    async function runDBCallAsync(url) {
        // send request to the api route
        const res = await fetch(url);
        // parse the json coming back from the server
        const data = await res.json();

        // simple check for a successful registration
        if (data.data == "registered") {
            console.log("registration is valid!");
            // move user to login page
            window.location = "/";
        } else {
            // fallback log if registration failed
            console.log("registration not valid");
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
                        label="Password"
                        type="password"
                        id="pass"
                        autoComplete="new-password"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="address"
                        label="Address"
                        type="text"
                        id="address"
                        autoComplete="street-address"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="Phone"
                        type="tel"
                        id="phone"
                        autoComplete="tel"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-email"
                        label="Confirm Email"
                        type="email"
                        id="confirmEmail"
                        autoComplete="email"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-pass"
                        label="Confirm Password"
                        type="password"
                        id="confirmPass"
                        autoComplete="new-password"
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
                        Register
                    </Button>

                </Box>
            </Box>
        </Container>
    );
}
