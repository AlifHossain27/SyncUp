"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { get_subscriber_growth } from "@/actions/newsletters"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  subscribers: {
    label: "Subscribers",
    color: "hsl(var(--primary))",
  },
}

type SubscriberGrowth = {
  month: string
  subscribers: number
}


const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const DataChart = () => {
  const [chartData, setChartData] = useState<SubscriberGrowth[]>([])

  useEffect(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const fetchData = async () => {
      let yearToFetch = currentYear
      if (currentMonth === 0) yearToFetch = currentYear - 1

      const res = await get_subscriber_growth(yearToFetch)
      if (res.ok) {
        let data: SubscriberGrowth[] = res.body
        const endMonthIndex = currentMonth === 0 ? 0 : currentMonth
        data = data.filter(item => monthNames.indexOf(item.month) <= endMonthIndex)
        setChartData(data)
      } else {
        console.error("Failed to load growth data", res.status)
      }
    }

    fetchData()
  }, [])

  return (
    <section id="data" className="py-20 md:py-28 bg-[#f8f8f8]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            Community Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our community is growing every month, bringing new perspectives and ideas.
          </p>
        </div>
        <Card className="border-border bg-background">
          <CardHeader>
            <CardTitle>Subscriber Growth</CardTitle>
            <CardDescription>
              {`January - ${monthNames[new Date().getMonth()]} ${new Date().getFullYear()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[400px]">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="subscribers" fill="#ff6900" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default DataChart