"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Typography, Popover } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import * as d3 from "d3"

interface CorrelationData {
  stock1: string
  stock2: string
  correlation: number
}

interface StockData {
  [key: string]: Array<{ timestamp: number; price: number; volume?: number }>
}

interface HeatmapChartProps {
  correlationData: CorrelationData[]
  stocksData: StockData
  stocks: string[]
}

export default function HeatmapChart({ correlationData, stocksData, stocks }: HeatmapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredStock, setHoveredStock] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [stockStats, setStockStats] = useState<any>(null)

  // Define theme colors directly to avoid passing theme object
  const themeColors = {
    primary: "#00ffff",
    secondary: "#ff0080",
    info: "#0099ff",
    error: "#ff4444",
    warning: "#ffaa00",
    success: "#00ff88",
    grey: "#666666",
    background: "#0f0f19",
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  }

  // Color scale for correlation values
  const colorScale = d3
    .scaleLinear<string>()
    .domain([-1, 0, 1])
    .range([themeColors.info, themeColors.grey, themeColors.error])

  useEffect(() => {
    if (!correlationData || correlationData.length === 0 || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const margin = { top: 80, right: 80, bottom: 80, left: 80 }
    const cellSize = Math.min(
      (width - margin.left - margin.right) / stocks.length,
      (height - margin.top - margin.bottom) / stocks.length,
    )

    // Clear previous content
    svg.selectAll("*").remove()

    // Create the heatmap group
    const heatmap = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Add row labels
    heatmap
      .selectAll(".row-label")
      .data(stocks)
      .enter()
      .append("text")
      .attr("class", "row-label")
      .attr("x", -10)
      .attr("y", (d, i) => i * cellSize + cellSize / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", themeColors.primary)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("font-family", "var(--font-orbitron)")
      .style("letter-spacing", "0.1em")
      .style("cursor", "pointer")
      .text((d) => d)
      .on("mouseover", (event, d) => handleStockHover(event, d))
      .on("mouseout", () => handleStockLeave())

    // Add column labels
    heatmap
      .selectAll(".col-label")
      .data(stocks)
      .enter()
      .append("text")
      .attr("class", "col-label")
      .attr("x", (d, i) => i * cellSize + cellSize / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("fill", themeColors.primary)
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("font-family", "var(--font-orbitron)")
      .style("letter-spacing", "0.1em")
      .style("cursor", "pointer")
      .text((d) => d)
      .attr("transform", (d, i) => `rotate(-45, ${i * cellSize + cellSize / 2}, -10)`)
      .on("mouseover", (event, d) => handleStockHover(event, d))
      .on("mouseout", () => handleStockLeave())

    // Add cells
    const cells = heatmap
      .selectAll(".cell")
      .data(correlationData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => stocks.indexOf(d.stock1) * cellSize)
      .attr("y", (d) => stocks.indexOf(d.stock2) * cellSize)
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d) => colorScale(d.correlation))
      .attr("stroke", themeColors.primary)
      .attr("stroke-width", 1)
      .style("cursor", "pointer")

    // Add correlation values
    heatmap
      .selectAll(".cell-text")
      .data(correlationData)
      .enter()
      .append("text")
      .attr("class", "cell-text")
      .attr("x", (d) => stocks.indexOf(d.stock1) * cellSize + cellSize / 2)
      .attr("y", (d) => stocks.indexOf(d.stock2) * cellSize + cellSize / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d) => (Math.abs(d.correlation) > 0.5 ? "#fff" : "#000"))
      .style("font-size", "12px")
      .style("font-family", "var(--font-orbitron)")
      .style("font-weight", "bold")
      .style("letter-spacing", "0.05em")
      .text((d) => d.correlation.toFixed(2))

    // Add legend
    const legendWidth = 200
    const legendHeight = 20
    const legendX = width - margin.right - legendWidth
    const legendY = height - margin.bottom + 30

    const legendScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range([0, legendWidth / 2, legendWidth])

    const legendAxis = d3.axisBottom(legendScale).tickValues([-1, -0.5, 0, 0.5, 1]).tickFormat(d3.format(".1f"))

    const defs = svg.append("defs")
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "correlation-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")

    linearGradient.append("stop").attr("offset", "0%").attr("stop-color", colorScale(-1))
    linearGradient.append("stop").attr("offset", "50%").attr("stop-color", colorScale(0))
    linearGradient.append("stop").attr("offset", "100%").attr("stop-color", colorScale(1))

    svg
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#correlation-gradient)")
      .attr("stroke", themeColors.primary)
      .attr("stroke-width", 1)

    svg
      .append("g")
      .attr("transform", `translate(${legendX}, ${legendY + legendHeight})`)
      .call(legendAxis)
      .selectAll("text")
      .attr("fill", themeColors.text.secondary)
      .style("font-family", "var(--font-orbitron)")
      .style("font-size", "10px")

    svg
      .append("text")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY - 10)
      .attr("text-anchor", "middle")
      .attr("fill", themeColors.primary)
      .style("font-size", "14px")
      .style("font-family", "var(--font-orbitron)")
      .style("font-weight", "bold")
      .style("letter-spacing", "0.1em")
      .text("QUANTUM CORRELATION MATRIX")

    // Add animation to cells
    cells
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 20)
      .attr("opacity", 1)
  }, [correlationData, stocks])

  const handleStockHover = (event: any, stock: string) => {
    setHoveredStock(stock)
    setAnchorEl(event.currentTarget)

    if (stocksData && stocksData[stock]) {
      const prices = stocksData[stock].map((item) => item.price)
      const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length
      const stdDev = Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length)

      setStockStats({
        symbol: stock,
        average: avg.toFixed(2),
        stdDev: stdDev.toFixed(2),
        currentPrice: prices[prices.length - 1].toFixed(2),
      })
    }
  }

  const handleStockLeave = () => {
    setHoveredStock(null)
    setAnchorEl(null)
  }

  if (!correlationData || correlationData.length === 0) {
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
          NO QUANTUM CORRELATION DATA AVAILABLE
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <svg ref={svgRef} width="100%" height="100%" />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleStockLeave}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableRestoreFocus
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 2,
            background: themeColors.background,
            border: `1px solid ${themeColors.primary}`,
            boxShadow: `0 0 20px ${themeColors.primary}40`,
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <AnimatePresence mode="wait">
          {stockStats && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                  fontFamily: "var(--font-orbitron)",
                  letterSpacing: "0.1em",
                  color: themeColors.primary,
                }}
              >
                {stockStats.symbol}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontFamily: "var(--font-orbitron)",
                  letterSpacing: "0.05em",
                  color: themeColors.text.primary,
                }}
              >
                CURRENT: ${stockStats.currentPrice}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontFamily: "var(--font-orbitron)",
                  letterSpacing: "0.05em",
                  color: themeColors.text.primary,
                }}
              >
                AVERAGE: ${stockStats.average}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "var(--font-orbitron)",
                  letterSpacing: "0.05em",
                  color: themeColors.text.primary,
                }}
              >
                STD DEV: ${stockStats.stdDev}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Popover>
    </Box>
  )
}
