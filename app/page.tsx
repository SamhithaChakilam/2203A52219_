"use client"

import { Box, Typography, Button, Container } from "@mui/material"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { TrendingUp, EqualIcon as Equalizer } from "lucide-react"
import { useEffect, useState } from "react"

// Animated particles component
const AnimatedParticles = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const router = useRouter()

  return (
    <>
      <AnimatedParticles />
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 64px)",
            textAlign: "center",
            py: 4,
            position: "relative",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              className="glow-text"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(45deg, #00ffff, #ff0080)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              NEURAL STOCK ANALYTICS
            </Typography>
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                paragraph
                sx={{
                  background: "linear-gradient(90deg, #00ffff, #ff0080, #00ff88, #ffaa00)",
                  backgroundSize: "300% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 500,
                }}
              >
                QUANTUM-POWERED MARKET INTELLIGENCE
              </Typography>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Box
              sx={{
                mt: 6,
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<TrendingUp />}
                  onClick={() => router.push("/stock")}
                  className="neon-border"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                      transition: "left 0.5s",
                    },
                    "&:hover::before": {
                      left: "100%",
                    },
                  }}
                >
                  NEURAL CHARTS
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Equalizer />}
                  onClick={() => router.push("/heatmap")}
                  className="holographic"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: "1.1rem",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                      transition: "left 0.5s",
                    },
                    "&:hover::before": {
                      left: "100%",
                    },
                  }}
                >
                  QUANTUM HEATMAP
                </Button>
              </motion.div>
            </Box>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "20%",
              right: "10%",
              width: "60px",
              height: "60px",
              background: "linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 128, 0.2))",
              borderRadius: "50%",
              border: "1px solid rgba(0, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          />

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            style={{
              position: "absolute",
              bottom: "20%",
              left: "15%",
              width: "40px",
              height: "40px",
              background: "linear-gradient(45deg, rgba(255, 0, 128, 0.2), rgba(0, 255, 136, 0.2))",
              borderRadius: "50%",
              border: "1px solid rgba(255, 0, 128, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          />
        </Box>
      </Container>
    </>
  )
}
