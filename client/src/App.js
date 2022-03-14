import React from "react";
import {
   BrowserRouter as Router,
   Switch,
   Redirect,
   Route,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { TextEncryption } from "./pages/TextEncryption";
import { FileEncryption } from "./pages/FileEncryption";
import { TextDecryption } from "./pages/TextDecryption";
import { FileDecryption } from "./pages/FileDecryption";
import { Flex } from "@chakra-ui/react";
import Menubar from "./components/Menubar";
import { AudioEncryption } from "./pages/AudioEncryption";

function App() {
   return (
      <div
         style={{
            height: "100%",
            position: "absolute",
            left: "0",
            width: "100%",
            overflow: "hidden",
         }}
      >
         <Flex minH="100vh" minW="100vw" direction="row">
            <Router>
               <Menubar />
               <Switch>
                  <Route exact path="/text-encryption">
                     <TextEncryption />
                  </Route>
                  <Route exact path="/file-encryption">
                     <FileEncryption />
                  </Route>
                  <Route exact path="/text-decryption">
                     <TextDecryption />
                  </Route>
                  <Route exact path="/file-decryption">
                     <FileDecryption />
                  </Route>
                  <Route exact path="/audio-encryption">
                     <AudioEncryption />
                  </Route>
                  <Route exact path="/">
                     <Home />
                  </Route>
                  <Redirect to="/" />
               </Switch>
            </Router>
         </Flex>
      </div>
   );
}

export { App };
