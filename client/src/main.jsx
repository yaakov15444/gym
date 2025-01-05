import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
const client_id = import.meta.env.VITE_CLIENT_ID;
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
const supabase = createClient(
  "https://pbyadsjuigvefkgtbanz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieWFkc2p1aWd2ZWZrZ3RiYW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3ODgzNzIsImV4cCI6MjA1MDM2NDM3Mn0.DCz2mndMoQrVx1H3kxhDcI8cRGaniO3GCwyi9_64PJ4"
);

createRoot(document.getElementById("root")).render(
  <SessionContextProvider supabaseClient={supabase}>
    <GoogleOAuthProvider clientId={client_id}>
      <App />
    </GoogleOAuthProvider>
  </SessionContextProvider>
);
