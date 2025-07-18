import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function useLanguageEffect(language: string) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!i18n || !i18n.changeLanguage) {
      console.error("i18n instance is not available");

      return;
    }

    i18n.changeLanguage(language).catch(() => {
      toast.error("Failed to change language.");
    });
  }, [language, i18n]);
}

export default useLanguageEffect;
