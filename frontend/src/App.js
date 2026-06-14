import React, { useState } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  InputAdornment,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#63b3ed",
      light: "#90cdf4",
      dark: "#2b6cb0",
    },
    background: {
      default: "#0a0e1a",
      paper: "#111827",
    },
    success: {
      main: "#48bb78",
    },
    error: {
      main: "#fc8181",
    },
    text: {
      primary: "#f7fafc",
      secondary: "#a0aec0",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.95rem",
          padding: "10px 24px",
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#1a2235",
            "& fieldset": {
              borderColor: "#2d3748",
            },
            "&:hover fieldset": {
              borderColor: "#63b3ed",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#63b3ed",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #1e2d45",
          backgroundImage: "none",
        },
      },
    },
  },
});

const POPULAR_COINS = ["bitcoin", "ethereum", "solana", "dogecoin"];

export default function App() {
  const [coin, setCoin] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCrypto = async (coinName) => {
    const target = coinName || coin;
    if (!target.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:5000/crypto?coin=${encodeURIComponent(target.trim().toLowerCase())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Algo deu errado. Tente novamente.");
      } else {
        setResult(data);
        setCoin(target);
      }
    } catch {
      setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchCrypto();
  };

  const change = result?.change_24h;
  const isPositive = change >= 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "radial-gradient(ellipse at 20% 0%, #0d1f3c 0%, #0a0e1a 60%)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            borderBottom: "1px solid #1a2540",
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <CurrencyBitcoinIcon sx={{ color: "#63b3ed", fontSize: 28 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "#f7fafc", letterSpacing: "-0.01em" }}
          >
            CryptoPrice
          </Typography>
        </Box>

        {/* Main */}
        <Container maxWidth="sm" sx={{ flex: 1, py: 8 }}>
          {/* Hero */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.4rem", sm: "3.2rem" },
                color: "#f7fafc",
                mb: 1.5,
              }}
            >
              Preço em tempo real
            </Typography>
            <Typography variant="body1" sx={{ color: "#718096", fontSize: "1.05rem" }}>
              Consulte qualquer criptomoeda pelo ID do CoinGecko
            </Typography>
          </Box>

          {/* Search */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="ex: bitcoin, ethereum, solana…"
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#4a6fa5" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={() => fetchCrypto()}
              disabled={loading || !coin.trim()}
              sx={{
                minWidth: 110,
                background: "linear-gradient(135deg, #2b6cb0, #63b3ed)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2c5282, #4299e1)",
                },
                "&.Mui-disabled": {
                  opacity: 0.4,
                },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Buscar"}
            </Button>
          </Box>

          {/* Quick access */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 5 }}>
            {POPULAR_COINS.map((c) => (
              <Chip
                key={c}
                label={c}
                size="small"
                onClick={() => {
                  setCoin(c);
                  fetchCrypto(c);
                }}
                className="ticker-badge"
                sx={{
                  backgroundColor: "#1a2235",
                  border: "1px solid #2d3748",
                  color: "#90cdf4",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#1e2d45",
                    borderColor: "#63b3ed",
                  },
                }}
              />
            ))}
          </Box>

          {/* Error */}
          {error && (
            <Box
              sx={{
                mb: 3,
                px: 2.5,
                py: 1.8,
                backgroundColor: "#1a1020",
                border: "1px solid #742a2a",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Typography sx={{ fontSize: "1rem" }}>⚠️</Typography>
              <Typography variant="body2" sx={{ color: "#fc8181" }}>
                {error}
              </Typography>
            </Box>
          )}

          {/* Result */}
          {result && (
            <Card
              className="result-card"
              sx={{ backgroundColor: "#111827" }}
            >
              <CardContent sx={{ p: 3.5 }}>
                {/* Coin name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                  <Chip
                    label={result.coin.toUpperCase()}
                    className="ticker-badge"
                    sx={{
                      backgroundColor: "#1a2235",
                      border: "1px solid #2d4a72",
                      color: "#63b3ed",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    via CoinGecko
                  </Typography>
                </Box>

                {/* Price */}
                <Typography
                  className="price-display"
                  sx={{
                    fontSize: "2.8rem",
                    fontWeight: 800,
                    color: "#f7fafc",
                    lineHeight: 1,
                    mb: 2.5,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {result.price_usd.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: result.price_usd < 1 ? 6 : 2,
                    maximumFractionDigits: result.price_usd < 1 ? 6 : 2,
                  })}
                </Typography>

                <Divider sx={{ borderColor: "#1e2d45", mb: 2.5 }} />

                {/* 24h change */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {isPositive ? (
                    <TrendingUpIcon sx={{ color: "#48bb78", fontSize: 20 }} />
                  ) : (
                    <TrendingDownIcon sx={{ color: "#fc8181", fontSize: 20 }} />
                  )}
                  <Typography variant="body2" sx={{ color: "#718096" }}>
                    Variação 24h
                  </Typography>
                  <Typography
                    className="price-display"
                    sx={{
                      ml: "auto",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: isPositive ? "#48bb78" : "#fc8181",
                    }}
                  >
                    {isPositive ? "+" : ""}
                    {change?.toFixed(2)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Footer */}
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="caption" sx={{ color: "#2d3748" }}>
            Dados fornecidos pela API CoinGecko
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}