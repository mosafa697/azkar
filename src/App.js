import React from "react";
import AzkarApp from "./components/AzkarApp";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AzkarApp />
    </ErrorBoundary>
  );
}

export default App;
