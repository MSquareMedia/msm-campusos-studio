"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Voice in and out via the browser's own speech APIs.
 *
 * No cloud service and no key: SpeechRecognition and speechSynthesis ship in
 * the browser. The trade is uneven support, recognition is Chrome/Edge/Safari
 * with a vendor prefix and simply absent in Firefox, so `supported` is
 * exposed and the UI hides the mic entirely rather than offering a button that
 * does nothing.
 */

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<
    ArrayLike<{ transcript: string }> & { isFinal: boolean }
  >;
};

function noopSubscribe() {
  return () => {};
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useVoice({
  onFinalTranscript,
}: {
  onFinalTranscript: (text: string) => void;
}) {
  // Capability is read through useSyncExternalStore with a server snapshot of
  // `false`, matching useMediaQuery in src/lib/motion.ts. Reading it straight
  // during render would return false on the server and true in the browser,
  // and the mic button would be a hydration mismatch on every page load.
  const recognitionSupported = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(getRecognitionCtor()),
    () => false
  );
  const synthesisSupported = useSyncExternalStore(
    noopSubscribe,
    () => "speechSynthesis" in window,
    () => false
  );
  const supported = recognitionSupported || synthesisSupported;

  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // The callback is held in a ref so re-renders never force the recogniser to
  // be torn down and rebuilt mid-utterance.
  const callbackRef = useRef(onFinalTranscript);
  useEffect(() => {
    callbackRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-GB";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let pending = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalText += text;
        else pending += text;
      }
      setInterim(pending);
      if (finalText.trim()) {
        setInterim("");
        callbackRef.current(finalText.trim());
      }
    };

    recognition.onerror = (event) => {
      // "aborted" and "no-speech" are ordinary outcomes of the user changing
      // their mind or pausing; surfacing those as errors would be noise.
      if (event.error === "aborted" || event.error === "no-speech") {
        setListening(false);
        return;
      }
      setError(
        event.error === "not-allowed"
          ? "Microphone access was blocked. Enable it in your browser settings."
          : "The microphone stopped unexpectedly."
      );
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setError(null);
    // Speaking and listening at once would have OSiQ transcribe itself.
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setSpeaking(false);
    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if it is already running; treat that as already-on.
      setListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    setInterim("");
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Strip markdown so the synthesiser does not read asterisks and hashes out
    // loud, and drop URLs, which are unbearable spoken character by character.
    const spoken = text
      .replace(/```[\s\S]*?```/g, " code sample omitted. ")
      .replace(/https?:\/\/\S+/g, " a link ")
      .replace(/[*_#`>|]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!spoken) return;
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.lang = "en-GB";
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return {
    supported,
    recognitionSupported,
    listening,
    speaking,
    interim,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
