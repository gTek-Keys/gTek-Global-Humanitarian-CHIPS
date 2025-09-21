import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code } from "lucide-react";

interface Result {
  output?: string;
  [key: string]: unknown;
}

export default function AIDesignSuite() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ output: "⚠️ Error generating design." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white p-8">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">gTek AI Design Suite</h1>
      <p className="text-lg text-slate-300 mb-6 max-w-2xl">
        Enter a design prompt to generate concepts, layouts, or UI suggestions using AI.
      </p>

      <div className="mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 text-black rounded resize-none h-32"
          placeholder="e.g. Design a dashboard for Web3 portfolio visualization..."
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-4 bg-cyan-500 text-black px-6 py-2 rounded hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Design"}
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 p-6 rounded-xl shadow-lg text-sm"
        >
          <h2 className="text-lg font-semibold text-sky-300 mb-2 flex items-center gap-2">
            <Code size={18} /> AI Output
          </h2>
          <pre className="bg-slate-900 p-4 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  );
}