'use client';

import AddCircleOutlineIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = React.useState([]); 
  // state storing all cart items from DB

  React.useEffect(() => {
    async function loadCart() {
      // fetch cart contents from backend api
      const res = await fetch('/api/getCart');
      const json = await res.json();
      // update state with items returned by backend
      setCartItems(json.data || []);
    }
    // run once on mount
    loadCart();
  }, []);

  const handleIncrease = (id) => {
    // bump quantity for the matching item
    setCartItems((items) =>
      items.map((item) =>
        item._id === id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const handleDecrease = (id) => {
    // decrease quantity but never below 1
    setCartItems((items) =>
      items.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    // remove the item completely from cart
    setCartItems((items) => items.filter((item) => item._id !== id));
  };

  const handleOrderNow = async () => {
    // send updated cart to backend for order creation
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();

    // simple handling of backend responses
    if (data.data === 'order_placed') {
      alert('Order placed successfully!');
      window.location = '/dashboard';
    } else if (data.data === 'empty_cart') {
      alert('Your cart is empty!');
    } else {
      alert('Something went wrong.');
    }
  };

  const handleCancelOrder = () => {
    // clear cart on frontend
    setCartItems([]);
  };

  const handleBackToDashboard = () => {
    // redirect back to dashboard page
    window.location = '/dashboard';
  };

  const total = cartItems
    // sum total based on price × quantity
    .reduce(
      (sum, item) =>
        sum + (item.price || 0) * (item.quantity || 1),
      0
    )
    .toFixed(2); 
    // format to 2 decimal places

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* app bar (same style as dashboard) */}
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" size="small">MY ACCOUNT</Button>
          </Box>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6">McDonald&apos;s</Typography>
          </Box>

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

      <Box
        sx={{
          p: 2,
          maxWidth: 900,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Checkout
        </Typography>

        <Card>
          <CardContent>
            {cartItems.length === 0 ? (
              <Typography>Your cart is empty.</Typography>
            ) : (
              cartItems.map((item, index) => (
                <Box key={item._id}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 1,
                    }}
                  >
                    {/* item name + base price */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.pname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        €{(item.price || 0).toFixed(2)} each
                      </Typography>
                    </Box>

                    {/* quantity buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleDecrease(item._id)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>

                      <Typography>{item.quantity || 1}</Typography>

                      <IconButton size="small" onClick={() => handleIncrease(item._id)}>
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Box>

                    {/* line total + remove button */}
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        €
                        {(
                          (item.price || 0) * (item.quantity || 1)
                        ).toFixed(2)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => handleRemove(item._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* add divider except after last item */}
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h6">Total: €{total}</Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={handleBackToDashboard}>
                Back to dashboard
              </Button>

              <Button variant="outlined" color="error" onClick={handleCancelOrder}>
                Cancel order
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleOrderNow}
                disabled={cartItems.length === 0}
              >
                Order now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
