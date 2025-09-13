import { Card, CardContent } from "@/components/ui/card"

export function EventCard() {
  return (
    <Card className="overflow-hidden">
      <div
        className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-700"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white relative z-10">
            <h2 className="text-2xl font-bold mb-2 text-white drop-shadow-lg font-sans">Peace Agreement in 2025</h2>
            <p className="text-lg text-white/90 drop-shadow-md">Ukraine/USA/Russia</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">
            Will there be a peace agreement between Ukraine, USA, and Russia in 2025?
          </h3>
          <p className="text-muted-foreground">Bet on the outcome of this major geopolitical event</p>
        </div>
      </CardContent>
    </Card>
  )
}
