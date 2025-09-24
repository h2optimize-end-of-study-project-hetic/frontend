import { createContext, useContext, useState, type ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

type SnackbarSeverity = "success" | "error" | "warning" | "info";

type SnackbarMessage = {
  text: string;
  severity: SnackbarSeverity;
};

type SnackbarContextType = {
  showMessage: (msg: string, severity?: SnackbarSeverity) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<SnackbarMessage | null>(null);

  const showMessage = (text: string, severity: SnackbarSeverity = "info") => {
    setMessage({ text, severity });
  };

  const handleClose = () => {
    setMessage(null);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      {message && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          open={!!message}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            severity={message.severity}
            onClose={handleClose}
            sx={{ width: "100%" }}
          >
            {message.text}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar doit être utilisé dans un SnackbarProvider");
  }
  return context;
};
