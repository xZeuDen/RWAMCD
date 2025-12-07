'use client';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// array with all menu products shown on dashboard
const products = [
  { id: 1, name: 'Big Mac Meal', price: 8.99, image: '/images/bigmac.jpg' },
  { id: 2, name: 'Chicken McNuggets', price: 6.49, image: '/images/nuggets.jpg' },
  { id: 3, name: 'McChicken Sandwich', price: 5.99, image: '/images/mcchicken.jpg' },
  { id: 4, name: 'Filet-O-Fish', price: 5.49, image: '/images/filet.jpg' },
  { id: 5, name: 'Fries Large', price: 2.99, image: '/images/fries.jpg' },
  { id: 6, name: 'McFlurry', price: 3.49, image: '/images/mcflurry.jpg' },
  { id: 7, name: 'Coca-Cola', price: 1.99, image: '/images/coke.jpg' },
  { id: 8, name: 'Chicken Wrap', price: 4.99, image: '/images/wrap.jpg' },
];

export default function DashboardPage() {
  // main wrapper that holds the whole dashboard layout
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* left side button for going to manager dashboard */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              size="small"
              onClick={() => (window.location = '/manager')}
            >
              MANAGER DASHBOARD
            </Button>
          </Box>

          {/* center area with McDonald's title */}
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" component="div">
              McDonald&apos;s
            </Typography>
          </Box>

          {/* right side cart icon that sends user to checkout page */}
          <Box>
            <IconButton
              color="inherit"
              aria-label="cart"
              onClick={() => (window.location = '/checkout')}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* grid that lays out all the product cards nicely */}
      <Box
        sx={{
          p: 2,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {products.map((product) => {
          // single product card for each menu item
          return (
            <Card
              key={product.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  height: 160,
                  width: '100%',
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  €{product.price.toFixed(2)}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  onClick={() => putInCart(product)}
                >
                  ADD TO CART
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
    </Box>
  );

  // helper function that calls backend api to save item in db cart
  function putInCart(product) {
    console.log('putting in cart: ' + product.name);

    fetch(
      'http://localhost:3000/api/putInCart' +
        `?pname=${encodeURIComponent(product.name)}` +
        `&price=${product.price}`
    );
  }
}