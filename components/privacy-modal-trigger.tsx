"use client";

import { useState, useEffect } from "react";
import PrivacyOption4 from "@/components/privacy-option-4";

export default function PrivacyModalTrigger() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    // Ensure this only runs on the client side
    if (typeof window !== "undefined") {
      if (localStorage.getItem('privacyModalSeen') !== 'true') {
        setShowPrivacyModal(true);
      }
    }
  }, []);

  if (!showPrivacyModal) {
    return null;
  }

  return <PrivacyOption4 />;
} 