"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Container, Typography, Box, Slider, Paper, CircularProgress, Alert, Chip } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { fetchMultipleStocksData } from "@/lib/api"
import HeatmapChart from "@/components/heatmap-chart"
import { debounce } from "@/lib/utils"
import { calculateCorrelations } from "@/lib/correlation"
import { Zap, Brain, Clock } from "lucide-react"

const stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NFLX"]
const timeIntervals = [5, 10, 15, 30, 60]

interface StockData {
  [key: string]: Array<{ timestamp: number; price: number; volume?: number }>
}

interface CorrelationData {
  stock1: string
  stock2: string
  correlation: number
}

export default function HeatmapPage() {
  const [timeInterval, setTimeInterval] = useState<number>(15)
  const [stocksData, setStocksData] = useState<StockData>({})
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const fetchDataFunction = useCallback(async (minutes: number) => {
    setLoading(true)
    setError("")
    try {
      const data = await fetchMultipleStocksData(stocks, minutes)
      setStocksData(data)

      const correlations = calculateCorrelations(data)
      setCorrelationData(correlations)
    } catch (err) {
      console.error("Error fetching stocks data:", err)
      setError("Quantum matrix calculation failed. Recalibrating...")
      setStocksData({})
      setCorrelationData([])
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedFetchData = useMemo(() => debounce(fetchDataFunction, 500), [fetchDataFunction])

  useEffect(() => {
    debouncedFetchData(timeInterval)
  }, [timeInterval, debouncedFetchData])

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
                "0 0 10px rgba(255, 0, 128, 0.5)",
                "0 0 20px rgba(255, 0, 128, 0.8)",
                "0 0 10px rgba(255, 0, 128, 0.5)",
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
                background: "linear-gradient(45deg, #ff0080, #00ffff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              QUANTUM CORRELATION MATRIX
            </Typography>
          </motion.div>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
            <Chip
              icon={<Zap size={16} />}
              label="QUANTUM"
              color="primary"
              variant="outlined"
              sx={{
                fontFamily: "var(--font-orbitron)",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            />
            <Chip
              icon={<Brain size={16} />}
              label="AI-MATRIX"
              color="secondary"
              variant="outlined"
              sx={{
                fontFamily: "var(--font-orbitron)",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            />
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
                background: "linear-gradient(45deg, rgba(255, 0, 128, 0.05), rgba(0, 255, 255, 0.05))",
                zIndex: -1,
              },
            }}
          >
            <Box sx={{ width: 320, mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Clock size={18} style={{ marginRight: "8px", color: "#ff0080" }} />
                <Typography
                  gutterBottom
                  sx={{
                    fontFamily: "var(--font-orbitron)",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "#ff0080",
                  }}
                >
                  QUANTUM TEMPORAL RANGE (MINUTES)
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

            <Box sx={{ height: 600, position: "relative" }}>
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
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                      }}
                    >
                      <CircularProgress
                        size={60}
                        sx={{
                          color: "#ff0080",
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
                        color: "#ff0080",
                      }}
                    >
                      QUANTUM MATRIX PROCESSING...
                    </Typography>
                  </motion.div>
                ) : (
                  <motion.div
                    key="heatmap"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    style={{ height: "100%" }}
                  >
                    <HeatmapChart correlationData={correlationData} stocksData={stocksData} stocks={stocks} />
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
