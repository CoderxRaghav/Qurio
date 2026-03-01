const normalizeBaseUrl = (value?: string): string | null => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.replace(/\/+$/, "");
};

const DEFAULT_BASE_URLS = ["/api", "http://127.0.0.1:8000", "http://localhost:8000"];
const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const API_BASE_URLS = configuredBaseUrl
  ? [configuredBaseUrl, ...DEFAULT_BASE_URLS.filter((url) => url !== configuredBaseUrl)]
  : DEFAULT_BASE_URLS;

const buildNetworkError = () =>
  new Error(
    `Unable to contact the AI backend. Start FastAPI on http://127.0.0.1:8000, then refresh and try again.`,
  );

const buildUrl = (baseUrl: string, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

const isFallbackStatus = (status: number) => [404, 502, 503, 504].includes(status);

export interface UploadResponse {
  message: string;
  filename: string;
}

export interface GenerateResponse {
  message: string;
  output_file: string;
  output_files?: Record<string, string>;
  questions?: string;
  answers?: string;
  warnings?: Array<{
    script: string;
    message: string;
    stdout?: string;
    stderr?: string;
  }>;
  logs?: Array<{
    script: string;
    stdout?: string;
    stderr?: string;
    returncode?: number;
  }>;
}

export interface TopicGenerateRequest {
  subject: string;
  difficulty: number;
  count: number;
  type: "mcq" | "short" | "long" | "mixed";
}

export interface TopicGenerateResponse {
  message: string;
  mode: "topic-config";
  questions: string;
  analysis: {
    subject: string;
    difficulty: number;
    difficulty_label: "Easy" | "Medium" | "Hard";
    question_count: number;
    question_type: "mcq" | "short" | "long" | "mixed";
    question_type_label: "MCQ" | "Short Answer" | "Long Answer" | "Mixed";
    model: string;
    source: "llm" | "fallback" | "topic-config";
    generated_at: string;
    rationale?: string;
  };
}

export interface ResultsResponse {
  text: string;
  questions?: string;
  answers?: string;
  output_files?: Record<string, string>;
}

export interface AnalysisResponse {
  subject: string;
  importance: string;
  uses: string[];
  model: string;
  source: string;
  generated_at: string;
}

export interface HistoryItem {
  id: number;
  created_at: string;
  subject: string;
  uploaded_files: string[];
  questions_count: number;
  preview: string[];
}

export interface HistoryResponse {
  items: HistoryItem[];
}

export interface AskQurioRequest {
  question: string;
  marks: number;
}

export interface AskQurioResponse {
  question: string;
  marks: number;
  answer: string;
  source: "llm" | "llm-fallback";
}

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    if (typeof data?.detail?.message === "string") {
      return data.detail.message;
    }
    if (typeof data?.message === "string") {
      return data.message;
    }
  } catch {
    // Fall through to status text.
  }

  return `${response.status} ${response.statusText}`;
};

const apiFetch = async (path: string, init?: RequestInit): Promise<Response> => {
  let fallbackResponse: Response | null = null;

  for (let index = 0; index < API_BASE_URLS.length; index += 1) {
    const baseUrl = API_BASE_URLS[index];
    const hasMoreCandidates = index < API_BASE_URLS.length - 1;

    try {
      const response = await fetch(buildUrl(baseUrl, path), init);
      if (hasMoreCandidates && isFallbackStatus(response.status)) {
        fallbackResponse = response;
        continue;
      }
      return response;
    } catch (error) {
      if (error instanceof TypeError && hasMoreCandidates) {
        continue;
      }
      if (error instanceof TypeError) {
        throw buildNetworkError();
      }
      throw error;
    }
  }

  if (fallbackResponse) {
    return fallbackResponse;
  }

  throw buildNetworkError();
};

export const uploadFile = async (file: File, replace = false): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch(`/upload?replace=${replace}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as UploadResponse;
};

export const generatePaper = async (): Promise<GenerateResponse> => {
  const response = await apiFetch("/generate", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as GenerateResponse;
};

export const generatePaperFromTopic = async (payload: TopicGenerateRequest): Promise<TopicGenerateResponse> => {
  const response = await apiFetch("/generate/topic", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as TopicGenerateResponse;
};

export const fetchResults = async (): Promise<ResultsResponse> => {
  const response = await apiFetch("/results");

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as ResultsResponse;
};

export const fetchAnalysis = async (): Promise<AnalysisResponse> => {
  const response = await apiFetch("/analysis");

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as AnalysisResponse;
};

export const fetchHistory = async (): Promise<HistoryResponse> => {
  const response = await apiFetch("/history");

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as HistoryResponse;
};

export const askQurio = async (payload: AskQurioRequest): Promise<AskQurioResponse> => {
  const response = await apiFetch("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 404) {
    throw new Error("Ask Qurio endpoint is not available. Restart FastAPI backend and try again.");
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as AskQurioResponse;
};
