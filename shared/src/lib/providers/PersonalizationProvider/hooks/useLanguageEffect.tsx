import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function useLanguageEffect(language: string) {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language).catch(() => {
      toast.error("Failed to change language.");
    });
  }, [language]);
}

export default useLanguageEffect;
