"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

const chartData = [
  { month: "January", subscribers: 186 },
  { month: "February", subscribers: 305 },
  { month: "March", subscribers: 237 },
  { month: "April", subscribers: 273 },
  { month: "May", subscribers: 209 },
  { month: "June", subscribers: 214 },
]

const chartConfig = {
  subscribers: {
    label: "Subscribers",
    color: "hsl(var(--primary))",
  },
}

const DataChart = () => {
  return (
     <section id="data" className="py-20 md:py-28 bg-[#f8f8f8]">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Community Growth</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our community is growing every month, bringing new perspectives and ideas.
                </p>
            </div>
            <Card className="border-border bg-background">
                <CardHeader>
                <CardTitle>Subscriber Growth - 2025</CardTitle>
                <CardDescription>January - June 2025</CardDescription>
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

export default DataChart;
