"use client"

import { useState, useEffect } from "react"
import { Box, Chip, IconButton, Tooltip, Typography, Alert, Collapse } from "@mui/material"
import { Database, RefreshCw, ChevronDown, ChevronUp, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { testAuthentication, getDemoInfo } from "@/lib/api"

export default function ApiStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [demoInfo] = useState(getDemoInfo())

  const checkConnection = async () => {
    setIsLoading(true)
    try {
      console.log("🎭 Refreshing demonstration data...")
      await testAuthentication()
      setLastChecked(new Date())
      console.log("✅ Demo mode active and working!")
    } catch (error) {
      console.log("Demo mode check completed")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initialize on mount
    checkConnection()
  }, [])

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Chip
          icon={
            isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <RefreshCw size={16} />
              </motion.div>
            ) : (
              <Database size={16} />
            )
          }
          label={isLoading ? "UPDATING..." : "LIVE DEMO"}
          color="success"
          variant="outlined"
          sx={{
            fontFamily: "var(--font-orbitron)",
            fontWeight: 600,
            letterSpacing: "0.05em",
            fontSize: "0.75rem",
          }}
        />

        <Tooltip
          title={
            <Box>
              <Typography variant="body2">Status: Live Demonstration Mode</Typography>
              <Typography variant="body2">Data: Realistic Market Simulation</Typography>
              <Typography variant="body2">Last updated: {lastChecked?.toLocaleTimeString() || "Never"}</Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                All features fully functional with simulated data
              </Typography>
            </Box>
          }
        >
          <IconButton
            size="small"
            onClick={checkConnection}
            disabled={isLoading}
            sx={{
              color: "#00ff88",
              "&:hover": {
                background: "rgba(0, 255, 136, 0.1)",
              },
            }}
          >
            <TrendingUp size={16} />
          </IconButton>
        </Tooltip>

        <IconButton
          size="small"
          onClick={() => setShowDetails(!showDetails)}
          sx={{
            color: "#00ff88",
            "&:hover": {
              background: "rgba(0, 255, 136, 0.1)",
            },
          }}
        >
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </IconButton>
      </Box>

      <Collapse in={showDetails}>
        <Alert
          severity="success"
          sx={{
            mt: 1,
            maxWidth: 450,
            background: "rgba(0, 255, 136, 0.1)",
            border: "1px solid rgba(0, 255, 136, 0.3)",
            "& .MuiAlert-message": {
              fontFamily: "var(--font-orbitron)",
              fontWeight: 500,
              fontSize: "0.75rem",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            🚀 Neural Stock Analytics - Live Demo
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.7rem", mb: 1 }}>
            Experience the full power of quantum-powered market intelligence with our advanced simulation engine.
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.7rem", fontWeight: 600, mb: 0.5 }}>
            Active Features:
          </Typography>
          {demoInfo.features.map((feature, index) => (
            <Typography key={index} variant="body2" sx={{ fontSize: "0.65rem", ml: 1 }}>
              • {feature}
            </Typography>
          ))}
        </Alert>
      </Collapse>
    </Box>
  )
}
