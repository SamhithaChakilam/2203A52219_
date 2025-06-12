"use client"

import { useMemo } from "react"
import { Box, Typography } from "@mui/material"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"
import { motion } from "framer-motion"

interface StockDataPoint {
  timestamp: number
  price: number
  volume?: number
}

interface StockChartProps {
  data: StockDataPoint[]
  stockSymbol: string
}

export default function StockChart({ data, stockSymbol }: StockChartProps) {
  // Define theme colors directly to avoid passing theme object
  const themeColors = {
    primary: "#00ffff",
    secondary: "#ff0080",
    warning: "#ffaa00",
    background: "#0f0f19",
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  }

  // Calculate average price
  const averagePrice = useMemo(() => {
    if (!data || data.length === 0) return 0
    const sum = data.reduce((acc, item) => acc + item.price, 0)
    return sum / data.length
  }, [data])

  // Format timestamp for display
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  // Custom tooltip component with animation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            backgroundColor: themeColors.background,
            padding: "12px",
            border: `1px solid ${themeColors.primary}`,
            borderRadius: "8px",
            boxShadow: `0 0 20px ${themeColors.primary}40`,
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: themeColors.text.secondary,
              fontFamily: "var(--font-orbitron)",
              letterSpacing: "0.05em",
            }}
          >
            {formatTimestamp(label)}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: themeColors.primary,
              fontWeight: "bold",
              fontFamily: "var(--font-orbitron)",
              letterSpacing: "0.05em",
            }}
          >
            PRICE: ${payload[0].value.toFixed(2)}
          </Typography>
          {payload[0].payload.volume && (
            <Typography
              variant="body2"
              sx={{
                color: themeColors.text.secondary,
                fontFamily: "var(--font-orbitron)",
                letterSpacing: "0.05em",
              }}
            >
              VOLUME: {payload[0].payload.volume.toLocaleString()}
            </Typography>
          )}
        </motion.div>
      )
    }
    return null
  }

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: themeColors.text.secondary,
            fontFamily: "var(--font-orbitron)",
            letterSpacing: "0.1em",
          }}
        >
          NO NEURAL DATA AVAILABLE FOR {stockSymbol}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={themeColors.divider} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            stroke={themeColors.text.secondary}
            style={{ fontFamily: "var(--font-orbitron)", fontSize: "10px" }}
          />
          <YAxis stroke={themeColors.text.secondary} style={{ fontFamily: "var(--font-orbitron)", fontSize: "10px" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontFamily: "var(--font-orbitron)",
              letterSpacing: "0.05em",
              fontSize: "12px",
            }}
          />
          <ReferenceLine
            y={averagePrice}
            label={{
              value: `AVG: $${averagePrice.toFixed(2)}`,
              position: "insideBottomRight",
              style: {
                fontFamily: "var(--font-orbitron)",
                fontSize: "10px",
                letterSpacing: "0.05em",
              },
            }}
            stroke={themeColors.warning}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="price"
            name={`${stockSymbol} NEURAL PRICE`}
            stroke={themeColors.primary}
            strokeWidth={3}
            dot={{ r: 4, fill: themeColors.primary }}
            activeDot={{
              r: 8,
              fill: themeColors.primary,
              stroke: themeColors.background,
              strokeWidth: 2,
            }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
