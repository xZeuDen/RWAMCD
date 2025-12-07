'use client';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import * as React from 'react';

export default function ManagerDashboard() {
  // loading flag for stats api
  const [loadingStats, setLoadingStats] = React.useState(true);
  // loading flag for weather api
  const [loadingWeather, setLoadingWeather] = React.useState(true);
  // store error message for stats call
  const [errorStats, setErrorStats] = React.useState('');
  // store error message for weather call
  const [errorWeather, setErrorWeather] = React.useState('');
  // total sales amount from backend
  const [totalSales, setTotalSales] = React.useState(0);
  // total number of customers from backend
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  // array with daily sales data for chart
  const [salesByDay, setSalesByDay] = React.useState([]);

  // weather info object
  const [weather, setWeather] = React.useState(null);

  // effect to load manager stats once when page mounts
  React.useEffect(() => {
    // inner async function so await can be used
    async function loadStats() {
      try {
        // call manager api route
        const res = await fetch('/api/manager');
        const data = await res.json();

        if (res.ok) {
          // set totals and daily stats if request ok
          setTotalSales(data.totalSales || 0);
          setTotalCustomers(data.totalCustomers || 0);
          setSalesByDay(data.salesByDay || []);
        } else {
          // store error text
          setErrorStats(data.error || 'Failed to load stats');
        }
      } catch (err) {
        // catch network / parsing errors
        setErrorStats(String(err));
      } finally {
        // mark stats loading as finished no matter what
        setLoadingStats(false);
      }
    }

    // run the async loader
    loadStats();
  }, []);

  // effect to load weather
  React.useEffect(() => {
    async function loadWeather() {
      try {
        // call weather api
        const res = await fetch('/api/weather');
        const data = await res.json();

        if (res.ok) {
          // keep clean weather object in state
          setWeather(data);
        } else {
          // store weather error text
          setErrorWeather(data.error || 'Failed to load weather');
        }
      } catch (err) {
        // catch any errors
        setErrorWeather(String(err));
      } finally {
        // mark weather loading as finished
        setLoadingWeather(false);
      }
    }

    // run weather loader
    loadWeather();
  }, []);

  // navigate back to customer dashboard
  const handleBackToDashboard = () => {
    window.location = '/dashboard';
  };

  // x axis labels for the chart (dates)
  const xLabels = salesByDay.map((d) => d.date);
  // y axis values for the chart (totals per day)
  const yValues = salesByDay.map((d) => d.total);

  // combined loading flag (stats or weather still loading)
  const isLoading = loadingStats || loadingWeather;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" size="small" onClick={handleBackToDashboard}>
              CUSTOMER VIEW
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6">Manager Dashboard</Typography>
          </Box>

          <Box>
            <Button
              color="inherit"
              startIcon={<ShoppingCartIcon />}
              onClick={() => (window.location = '/checkout')}
            >
              Checkout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          p: 2,
          maxWidth: 1100,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {isLoading && <Typography>Loading data...</Typography>}

        {!isLoading && (errorStats || errorWeather) && (
          <Box>
            {errorStats && (
              <Typography color="error">Stats error: {errorStats}</Typography>
            )}
            {errorWeather && (
              <Typography color="error">Weather error: {errorWeather}</Typography>
            )}
          </Box>
        )}

        {!isLoading && !errorStats && !errorWeather && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Total Customers
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {totalCustomers}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Total Sales
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      €{totalSales.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Weather (Dublin)
                    </Typography>

                    {weather ? (
                      <>
                        <Typography variant="h5" fontWeight="bold">
                          {Math.round(weather.temp)}°C
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {weather.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Feels like {Math.round(weather.feelsLike)}°C
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No weather data
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales by Day
                </Typography>

                {salesByDay.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No sales data yet.
                  </Typography>
                ) : (
                  <Box sx={{ width: '100%', height: 300 }}>
                    <LineChart
                      xAxis={[
                        {
                          data: xLabels,
                          scaleType: 'point',
                          label: 'Date',
                        },
                      ]}
                      series={[
                        {
                          data: yValues,
                          label: 'Total Sales (€)',
                        },
                      ]}
                      height={280}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
}
