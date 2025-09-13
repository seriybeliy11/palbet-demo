"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useMemo } from "react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

const generateMockData = (timeRange: "1d" | "1w" | "1m") => {
  const data = []
  const now = new Date()
  let dataPoints: number
  let intervalMs: number

  switch (timeRange) {
    case "1d":
      dataPoints = 24
      intervalMs = 60 * 60 * 1000 // 1 hour
      break
    case "1w":
      dataPoints = 7 * 24
      intervalMs = 60 * 60 * 1000 // 1 hour
      break
    case "1m":
      dataPoints = 30
      intervalMs = 24 * 60 * 60 * 1000 // 1 day
      break
  }

  let yesPercentage = 50 + (Math.random() - 0.5) * 20 // Start around 50%

  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date(now.getTime() - i * intervalMs)

    // Add some trend and volatility
    const trend = (Math.random() - 0.5) * 3
    const volatility = (Math.random() - 0.5) * 5
    yesPercentage = Math.max(20, Math.min(80, yesPercentage + trend + volatility))

    const formatDate = () => {
      if (timeRange === "1d") {
        return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      } else if (timeRange === "1w") {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      } else {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }
    }

    data.push({
      date: formatDate(),
      timestamp: date.getTime(),
      yes: Number(yesPercentage.toFixed(1)),
      no: Number((100 - yesPercentage).toFixed(1)),
      volume: Math.floor(Math.random() * 10000) + 1000, // Mock trading volume
    })
  }
  return data
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-border rounded-lg shadow-lg">
        <p className="font-medium text-sm mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Yes:</span>
            </div>
            <span className="font-medium text-green-600">{payload[0]?.value}%</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">No:</span>
            </div>
            <span className="font-medium text-red-600">{payload[1]?.value}%</span>
          </div>
          {payload[0]?.payload?.volume && (
            <div className="flex items-center justify-between space-x-4 pt-1 border-t">
              <span className="text-xs text-muted-foreground">Volume:</span>
              <span className="text-xs font-medium">{payload[0].payload.volume.toLocaleString()} USDT</span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function BettingChart() {
  const [timeRange, setTimeRange] = useState<"1d" | "1w" | "1m">("1m")
  const [data, setData] = useState(() => generateMockData("1m"))
  const [isLoading, setIsLoading] = useState(false)

  const statistics = useMemo(() => {
    if (data.length < 2) return null

    const latest = data[data.length - 1]
    const previous = data[data.length - 2]
    const yesChange = latest.yes - previous.yes
    const totalVolume = data.reduce((sum, item) => sum + item.volume, 0)

    return {
      currentYes: latest.yes,
      currentNo: latest.no,
      yesChange,
      totalVolume,
      trend: yesChange > 0 ? "up" : yesChange < 0 ? "down" : "stable",
    }
  }, [data])

  useEffect(() => {
    const refreshData = () => {
      setIsLoading(true)
      setTimeout(() => {
        setData(generateMockData(timeRange))
        setIsLoading(false)
      }, 500) // Simulate loading
    }

    const interval = setInterval(refreshData, 8 * 60 * 1000) // 8 minutes
    return () => clearInterval(interval)
  }, [timeRange])

  const handleTimeRangeChange = (range: "1d" | "1w" | "1m") => {
    setTimeRange(range)
    setIsLoading(true)
    setTimeout(() => {
      setData(generateMockData(range))
      setIsLoading(false)
    }, 300)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg md:text-xl">Betting Dynamics</CardTitle>
            <Activity className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          </div>
          <div className="flex space-x-1 md:space-x-2">
            {(["1d", "1w", "1m"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeRangeChange(range)}
                disabled={isLoading}
                className="text-xs md:text-sm px-2 md:px-3"
              >
                {range === "1d" ? "1D" : range === "1w" ? "1W" : "1M"}
              </Button>
            ))}
          </div>
        </div>

        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-green-600">{statistics.currentYes}%</div>
              <div className="text-xs text-muted-foreground">Yes</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-red-600">{statistics.currentNo}%</div>
              <div className="text-xs text-muted-foreground">No</div>
            </div>
            <div className="text-center">
              <div
                className={`text-xl md:text-2xl font-bold flex items-center justify-center space-x-1 ${
                  statistics.trend === "up"
                    ? "text-green-600"
                    : statistics.trend === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {statistics.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                ) : statistics.trend === "down" ? (
                  <TrendingDown className="h-4 w-4 md:h-5 md:w-5" />
                ) : null}
                <span>{Math.abs(statistics.yesChange).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-muted-foreground">Change</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-primary">
                {statistics.totalVolume > 1000000
                  ? `${(statistics.totalVolume / 1000000).toFixed(1)}M`
                  : `${(statistics.totalVolume / 1000).toFixed(0)}K`}
              </div>
              <div className="text-xs text-muted-foreground">Volume</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="yesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="noGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={{ stroke: "#9ca3af" }} />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickLine={{ stroke: "#9ca3af" }}
                label={{ value: "%", angle: 0, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="yes"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#yesGradient)"
                name="yes"
              />
              <Area type="monotone" dataKey="no" stroke="#ef4444" strokeWidth={2} fill="url(#noGradient)" name="no" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center space-x-4 md:space-x-8 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs md:text-sm font-medium">Yes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs md:text-sm font-medium">No</span>
          </div>
          <div className="text-xs text-muted-foreground hidden md:block">Updates every 8 minutes</div>
        </div>
      </CardContent>
    </Card>
  )
}
