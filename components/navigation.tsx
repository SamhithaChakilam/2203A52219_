"use client"

import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import { Menu, TrendingUp, EqualIcon as Equalizer, Home, Zap } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const navItems = [
    { name: "HOME", path: "/", icon: <Home size={18} /> },
    { name: "NEURAL CHARTS", path: "/stock", icon: <TrendingUp size={18} /> },
    { name: "QUANTUM MAP", path: "/heatmap", icon: <Equalizer size={18} /> },
  ]

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        background: "linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(26, 26, 46, 0.95))",
        height: "100%",
        backdropFilter: "blur(20px)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          my: 2,
          background: "linear-gradient(45deg, #00ffff, #ff0080)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700,
        }}
      >
        NEURAL ANALYTICS
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              sx={{
                textAlign: "center",
                "&:hover": {
                  background: "rgba(0, 255, 255, 0.1)",
                },
              }}
              onClick={() => handleNavigation(item.path)}
            >
              <Box sx={{ mr: 1, display: "flex", alignItems: "center", color: "#00ffff" }}>{item.icon}</Box>
              <ListItemText
                primary={item.name}
                sx={{
                  "& .MuiTypography-root": {
                    fontFamily: "Orbitron",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "#00ffff",
              "&:hover": {
                background: "rgba(0, 255, 255, 0.1)",
              },
            }}
          >
            <Menu />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ marginRight: "12px", color: "#00ffff" }}
            >
              <Zap size={28} />
            </motion.div>
            <span
              style={{
                background: "linear-gradient(45deg, #00ffff, #ff0080)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              NEURAL ANALYTICS
            </span>
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: "inline-block" }}
              >
                <Button
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    position: "relative",
                    color: pathname === item.path ? "#00ffff" : "inherit",
                    fontFamily: "Orbitron",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    "&:hover": {
                      background: "rgba(0, 255, 255, 0.1)",
                      color: "#00ffff",
                    },
                  }}
                >
                  <Box sx={{ mr: 0.5, display: "flex", alignItems: "center" }}>{item.icon}</Box>
                  {item.name}
                  {pathname === item.path && (
                    <motion.div
                      layoutId="navigation-underline"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 3,
                        background: "linear-gradient(90deg, #00ffff, #ff0080)",
                        borderRadius: "2px",
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            background: "transparent",
            border: "1px solid rgba(0, 255, 255, 0.2)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}
