// Calculate Pearson correlation coefficient between two arrays
const calculatePearsonCorrelation = (x: number[], y: number[]) => {
  const n = Math.min(x.length, y.length)

  if (n === 0) return 0

  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n
  const yMean = y.reduce((sum, val) => sum + val, 0) / n

  // Calculate covariance and standard deviations
  let covariance = 0
  let xStdDev = 0
  let yStdDev = 0

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean
    const yDiff = y[i] - yMean

    covariance += xDiff * yDiff
    xStdDev += xDiff * xDiff
    yStdDev += yDiff * yDiff
  }

  // Avoid division by zero
  if (xStdDev === 0 || yStdDev === 0) return 0

  // Calculate correlation
  return covariance / Math.sqrt(xStdDev * yStdDev)
}

// Align timestamps across different stocks
const alignTimestamps = (stocksData) => {
  const allTimestamps = new Set()

  // Collect all timestamps
  Object.values(stocksData).forEach((stockData) => {
    stockData.forEach((dataPoint) => {
      allTimestamps.add(dataPoint.timestamp)
    })
  })

  // Sort timestamps
  const sortedTimestamps = Array.from(allTimestamps).sort()

  // Create a map of timestamp to index
  const timestampMap = {}
  sortedTimestamps.forEach((timestamp, index) => {
    timestampMap[timestamp] = index
  })

  // Create aligned arrays for each stock
  const alignedData = {}

  Object.keys(stocksData).forEach((symbol) => {
    alignedData[symbol] = new Array(sortedTimestamps.length).fill(null)

    stocksData[symbol].forEach((dataPoint) => {
      const index = timestampMap[dataPoint.timestamp]
      alignedData[symbol][index] = dataPoint.price
    })

    // Fill in missing values with linear interpolation
    let lastValidIndex = -1

    // Forward pass
    for (let i = 0; i < alignedData[symbol].length; i++) {
      if (alignedData[symbol][i] !== null) {
        // If there are missing values between the last valid and current
        if (lastValidIndex !== -1 && i - lastValidIndex > 1) {
          const startValue = alignedData[symbol][lastValidIndex]
          const endValue = alignedData[symbol][i]
          const step = (endValue - startValue) / (i - lastValidIndex)

          // Fill in the gaps
          for (let j = lastValidIndex + 1; j < i; j++) {
            alignedData[symbol][j] = startValue + step * (j - lastValidIndex)
          }
        }
        lastValidIndex = i
      }
    }

    // Handle trailing nulls by using the last valid value
    if (lastValidIndex !== -1) {
      const lastValue = alignedData[symbol][lastValidIndex]
      for (let i = lastValidIndex + 1; i < alignedData[symbol].length; i++) {
        if (alignedData[symbol][i] === null) {
          alignedData[symbol][i] = lastValue
        }
      }
    }

    // Handle leading nulls by using the first valid value
    const firstValidIndex = alignedData[symbol].findIndex((val) => val !== null)
    if (firstValidIndex > 0 && firstValidIndex !== -1) {
      const firstValue = alignedData[symbol][firstValidIndex]
      for (let i = 0; i < firstValidIndex; i++) {
        alignedData[symbol][i] = firstValue
      }
    }
  })

  return alignedData
}

// Calculate correlations between all pairs of stocks
export const calculateCorrelations = (stocksData) => {
  if (!stocksData || Object.keys(stocksData).length === 0) return []

  // Align data by timestamp
  const alignedData = alignTimestamps(stocksData)
  const symbols = Object.keys(alignedData)
  const correlations = []

  // Calculate correlation for each pair of stocks
  for (let i = 0; i < symbols.length; i++) {
    for (let j = 0; j < symbols.length; j++) {
      const stock1 = symbols[i]
      const stock2 = symbols[j]

      // Skip if same stock (correlation would be 1)
      if (i === j) {
        correlations.push({
          stock1,
          stock2,
          correlation: 1,
        })
        continue
      }

      // Calculate correlation
      const correlation = calculatePearsonCorrelation(alignedData[stock1], alignedData[stock2])

      correlations.push({
        stock1,
        stock2,
        correlation,
      })
    }
  }

  return correlations
}
