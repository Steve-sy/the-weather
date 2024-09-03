import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Container,
  Card,
  Box,
  CardHeader,
  CardContent,
  Grid,
  Stack,
} from "@mui/material";
import "./App.css";
import "@fontsource/tajawal"; // Defaults to weight 400
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CloudIcon from "@mui/icons-material/Cloud";
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";
import { LocalActivity } from "@mui/icons-material";

const theme = createTheme({
  typography: {
    fontFamily: "Tajawal, Arial, sans-serif", // Ensure fallback fonts
  },
});

let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState();
  const [locale, setLocale] = useState("en");

  function handelChangeLang(lang) {
    if (locale === "en") {
      setLocale("ar");
      moment.locale("ar"); // ar-sa
      i18n.changeLanguage("ar");
    } else {
      setLocale("en");
      moment.locale("en"); // ar-sa
      i18n.changeLanguage("en");
    }
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
    setCurrentDate(moment().format("MMMM Do YYYY, h:mm:ss a")); // September 3rd 2024, 3:06:30 am
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather?lat=-33.8698439&lon=151.2082848&appid={your_key}",
          "https://api.openweathermap.org/data/2.5/weather",
          {
            cancelToken: new axios.CancelToken(function executor(c) {
              cancelAxios = c;
            }),
          }
        );
        setWeatherData(response.data);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch weather data. Please try again later.");
      }
    };

    fetchWeatherData();

    return () => {
      console.log("canceling");
      cancelAxios();
    };
  }, [locale]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "lightblue", // Dark blue background
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
      >
        <Container maxWidth="sm">
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : weatherData ? (
            // render weather data

            <div>
              <Card
                sx={{
                  textAlign: "center",
                  padding: 2,
                  color: "white",
                  backgroundColor: "darkblue", // White card background
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)", // Adding shadow to the card
                  borderRadius: "10px",
                }}
              >
                <CardHeader
                  title={
                    <Stack direction="row" justifyContent={"space-between"}>
                      <Typography variant="h3">{weatherData.name}</Typography>
                      <Typography variant="h5">{currentDate}</Typography>
                    </Stack>
                  }
                  sx={{
                    color: "white", // Dark blue text color for header
                    padding: 1,
                    borderRadius: "2px",
                    textAlign: "right",
                  }}
                />
                <hr />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={7} style={{ textAlign: "right" }}>
                      <Typography
                        variant="h1"
                        color=""
                        style={{
                          display: "flex",
                          justifyContent: "right",
                          alignItems: "center",
                        }}
                      >
                        {Math.round(weatherData.main.temp - 273.15)}

                        <img
                          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                          alt="weather condition"
                        />
                      </Typography>
                      <h3 style={{ fontSize: "30px", textAlign: "center" }}>
                        {t(weatherData.weather[0].description)}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p>
                          {t("temp_min")}:
                          {Math.round(weatherData.main.temp_min - 273.15)}
                        </p>
                        |
                        <p>
                          {t("temp_max")}:
                          {Math.round(weatherData.main.temp_max - 273.15)}
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={5}>
                      <CloudIcon
                        style={{
                          fontSize: "200px",
                          color: "white",
                          textAlign: "left",
                        }}
                      ></CloudIcon>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Button
                onClick={() => {
                  handelChangeLang();
                }}
              >
                {t("locale")}
              </Button>
            </div>
          ) : (
            <p>loading...</p>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
