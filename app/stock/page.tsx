"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  type SelectChangeEvent,
} from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { fetchStockData } from "@/lib/api"
import StockChart from "@/components/stock-chart"
import ApiStatus from "@/components/api-status"
import { debounce } from "@/lib/utils"
import { Activity, Clock } from "lucide-react"

const stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]
const timeIntervals = [5, 10, 15, 30, 60]

interface StockDataPoint {
  timestamp: number
  price: number
  volume?: number
}

export default function StockPage() {
  const [selectedStock, setSelectedStock] = useState<string>("AAPL")
  const [timeInterval, setTimeInterval] = useState<number>(15)
  const [stockData, setStockData] = useState<StockDataPoint[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const fetchDataFunction = useCallback(async (stock: string, minutes: number) => {
    setLoading(true)
    setError("")
    try {
      const data = await fetchStockData(stock, minutes)
      setStockData(data)
    } catch (err) {
      console.error("Error fetching stock data:", err)
      setError("Neural network connection failed. Retrying...")
      setStockData([])
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedFetchData = useMemo(() => debounce(fetchDataFunction, 500), [fetchDataFunction])

  useEffect(() => {
    debouncedFetchData(selectedStock, timeInterval)
  }, [selectedStock, timeInterval, debouncedFetchData])

  const handleStockChange = useCallback((event: SelectChangeEvent<string>) => {
    const value = event.target.value
    if (typeof value === "string") {
      setSelectedStock(value)
    }
  }, [])

  const handleTimeIntervalChange = useCallback((_event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setTimeInterval(newValue)
    }
  }, [])

  return (
    <Container maxWidth="lg">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Box sx={{ mt: 4, mb: 3, textAlign: "center" }}>
          <motion.div
            animate={{
              textShadow: [
                "0 0 10px rgba(0, 255, 255, 0.5)",
                "0 0 20px rgba(0, 255, 255, 0.8)",
                "0 0 10px rgba(0, 255, 255, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Typography
              variant="h4"
              component="h1"
              className="glow-text"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.1em",
                background: "linear-gradient(45deg, #00ffff, #ff0080)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NEURAL PRICE ANALYSIS
            </Typography>
          </motion.div>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
            <Chip
              icon={<Activity size={16} />}
              label="REAL-TIME"
              color="primary"
              variant="outlined"
              sx={{
                fontFamily: "var(--font-orbitron)",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            />
            <ApiStatus />
          </Box>
        </Box>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            className="neon-border holographic"
            sx={{
              p: 4,
              mb: 4,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(45deg, rgba(0, 255, 255, 0.05), rgba(255, 0, 128, 0.05))",
                zIndex: -1,
              },
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mb: 4, alignItems: "center" }}>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel
                    id="stock-select-label"
                    sx={{
                      fontFamily: "var(--font-orbitron)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    NEURAL TARGET
                  </InputLabel>
                  <Select
                    labelId="stock-select-label"
                    id="stock-select"
                    value={selectedStock}
                    label="NEURAL TARGET"
                    onChange={handleStockChange}
                    sx={{
                      fontFamily: "var(--font-orbitron)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stocks.map((stock) => (
                      <MenuItem
                        key={stock}
                        value={stock}
                        sx={{
                          fontFamily: "var(--font-orbitron)",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {stock}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </motion.div>

              <Box sx={{ width: 320 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Clock size={18} style={{ marginRight: "8px", color: "#00ffff" }} />
                  <Typography
                    gutterBottom
                    sx={{
                      fontFamily: "var(--font-orbitron)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      color: "#00ffff",
                    }}
                  >
                    TEMPORAL RANGE (MINUTES)
                  </Typography>
                </Box>
                <Slider
                  value={timeInterval}
                  onChange={handleTimeIntervalChange}
                  step={null}
                  marks={timeIntervals.map((interval) => ({
                    value: interval,
                    label: `${interval}M`,
                  }))}
                  min={timeIntervals[0]}
                  max={timeIntervals[timeIntervals.length - 1]}
                />
              </Box>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    background: "rgba(255, 68, 68, 0.1)",
                    border: "1px solid rgba(255, 68, 68, 0.3)",
                    "& .MuiAlert-message": {
                      fontFamily: "var(--font-orbitron)",
                      fontWeight: 500,
                    },
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}

            <Box sx={{ height: 500, position: "relative" }}>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <CircularProgress
                        size={60}
                        sx={{
                          color: "#00ffff",
                          "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                          },
                        }}
                      />
                    </motion.div>
                    <Typography
                      sx={{
                        mt: 2,
                        fontFamily: "var(--font-orbitron)",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "#00ffff",
                      }}
                    >
                      NEURAL PROCESSING...
                    </Typography>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    style={{ height: "100%" }}
                  >
                    <StockChart data={stockData} stockSymbol={selectedStock} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  )
}
