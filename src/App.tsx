import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/frontend/components/TransactionsTable/TransactionsTable";
import "./index.css";

export function App() {
  return (
    <div className="w-[95vw] max-w-[1800px] mx-auto px-4 sm:px-8 relative z-10">
      <Card>
        <CardHeader className="gap-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Bloxtax</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionsTable />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
