import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  tokens,
} from "@fluentui/react-components";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import { TeamsFxContext } from "./Context";
declare global {
  interface Window {
    microsoftTeams?: any;
  }
}

export default function App() {
  const [theme, setTheme] = useState("default");
  const [themeString, setThemeString] = useState("default");

  useEffect(() => {
    // Check if running in Teams
    if (window.microsoftTeams) {
      window.microsoftTeams.app.initialize().then(() => {
        window.microsoftTeams.app.getContext().then((context: { app: { theme?: string } }) => {
          setTheme(context.app.theme || "default");
          setThemeString(context.app.theme || "default");
        });
      });
    }
  }, []);

  return (
<TeamsFxContext.Provider value={{ theme: theme as any, themeString, teamsUserCredential: null }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : teamsLightTheme
        }
        style={{ background: tokens.colorNeutralBackground3 }}
      >
        <Router>
          <Routes>
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/termsofuse" element={<TermsOfUse />} />
            <Route path="/tab" element={<Tab />} />
            <Route path="*" element={<Navigate to={"/tab"} />} />
          </Routes>
        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}