import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, CloudUpload } from "lucide-react";
import { fetchResults, generatePaper, uploadFile } from "@/lib/api";
import { Link } from "react-router-dom";

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState("");
  const [pipelineWarnings, setPipelineWarnings] = useState<string[]>([]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf") || f.name.endsWith(".docx"));
    setFiles(prev => [...prev, ...dropped]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      setErrorMessage("Please select at least one file.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setGeneratedQuestions("");
    setPipelineWarnings([]);

    try {
      for (let idx = 0; idx < files.length; idx += 1) {
        await uploadFile(files[idx], idx === 0);
      }

      const generation = await generatePaper();
      const warningMessages = (generation.warnings ?? []).map((w) => `${w.script}: ${w.message}`);
      setPipelineWarnings(warningMessages);

      let questionsText = (generation.questions ?? generation.output_files?.["generated_question_paper.txt"] ?? "").trim();

      try {
        const result = await fetchResults();
        questionsText = (result.questions ?? result.text ?? questionsText).trim();
      } catch {
        // Keep generate response data if /results fetch fails.
      }

      setGeneratedQuestions(questionsText);
      setSuccessMessage(`Uploaded and processed ${files.length} file${files.length > 1 ? "s" : ""}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process files.";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Upload Papers</h1>
        <p className="text-muted-foreground mt-1">Upload question papers or study material for AI analysis</p>
      </div>

      {/* Dropzone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`glass-panel-hover rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${dragOver ? "neon-border bg-primary/5" : ""}`}
        whileHover={{ scale: 1.005 }}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input id="file-input" type="file" multiple accept=".pdf,.docx" className="hidden" onChange={handleFileInput} />
        <motion.div
          animate={dragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <CloudUpload className="w-16 h-16 mx-auto text-primary mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold text-foreground">Drop files here or click to browse</h3>
        <p className="text-sm text-muted-foreground mt-2">Supports PDF, DOCX • Max 50MB per file</p>
      </motion.div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Uploaded Files ({files.length})</h3>
          {files.map((file, i) => (
            <motion.div
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          <motion.button
            onClick={handleProcessFiles}
            disabled={isProcessing}
            className="btn-neon px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            {isProcessing ? "Processing..." : "Process Files"}
          </motion.button>
          {isProcessing && (
            <p className="text-xs text-muted-foreground">
              Processing can take around 1-2 minutes for full pipeline runs.
            </p>
          )}
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          {successMessage && <p className="text-sm text-primary">{successMessage}</p>}
          {pipelineWarnings.length > 0 && (
            <div className="glass-panel rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-2">Warnings</h4>
              {pipelineWarnings.map((warning, idx) => (
                <p key={`${warning}-${idx}`} className="text-xs text-muted-foreground">{warning}</p>
              ))}
            </div>
          )}
          {(generatedQuestions || successMessage) && (
            <div className="glass-panel rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-2">Generated Questions</h4>
              {generatedQuestions ? (
                <pre className="text-sm whitespace-pre-wrap break-words">{generatedQuestions}</pre>
              ) : (
                <p className="text-sm text-muted-foreground">Processing finished but no questions were extracted from the uploaded files.</p>
              )}
              <div className="mt-3">
                <Link to="/dashboard/question-paper" className="text-sm text-primary underline">
                  Open full question paper view
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
