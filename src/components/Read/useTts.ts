import { useState } from "react";
import { TextToSpeech } from "@capacitor-community/text-to-speech";

export const useTts = (onError?: (error: string) => void) => {
  const [isTtsActive, setIsTtsActive] = useState(false);

  const extractTextFromHTML = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const startTts = async (html: string) => {
    if (html) {
      setIsTtsActive(true);
      const text = extractTextFromHTML(html);
      const chunks = text.split(/[\n.,!?;]+/);
      for (let chunk of chunks) {
        const trimmedChunk = chunk.trim();
        if (!trimmedChunk) continue;
        try {
          await TextToSpeech.speak({
            text: trimmedChunk,
            lang: "en-US",
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: "ambient",
            queueStrategy: 1,
          });
        } catch (error) {
          console.error("Error during TTS:", error);
          if (onError) {
            onError(error instanceof Error ? error.message : String(error));
          }
          break;
        }
      }
    }
    setIsTtsActive(false);
  };

  const stopTts = async () => {
    try {
      await TextToSpeech.stop();
      setIsTtsActive(false);
    } catch (error) {
      console.error("Error stopping TTS:", error);
      if (onError) {
        onError(error instanceof Error ? error.message : String(error));
      }
    }
  };

  return {
    isTtsActive,
    setIsTtsActive,
    startTts,
    stopTts,
  };
};
