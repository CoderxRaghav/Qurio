import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";
import { fetchHistory, type HistoryItem } from "@/lib/api";

const HistoryPage = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHistory();
        setItems(data.items ?? []);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load history.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">History</h1>
        <p className="text-muted-foreground mt-1">View and manage your generated papers</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-muted-foreground">No real history yet. Generate once to create history.</p>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel-hover rounded-xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{item.subject || "Unknown Subject"}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.questions_count} questions</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{item.uploaded_files.length} file(s)</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-right max-w-[40%] truncate">
              {item.uploaded_files.join(", ")}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;
