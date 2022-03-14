import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
   fonts: {
      heading: "'Mulish', sans-serif",
      button: "'Mulish', sans-serif",
      body: "'Mulish', sans-serif",
      mono: "'Mulish', sans-serif",
      footer: "'Mulish', sans-serif",
   },
});

ReactDOM.render(
   <React.StrictMode>
      <ChakraProvider theme={theme}>
         <App />
      </ChakraProvider>
   </React.StrictMode>,
   document.getElementById("root")
);
