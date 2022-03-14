import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FcLock } from "react-icons/fc";
const Menubar = () => {
   return (
      <Box
         w="255px"
         bg="#363740"
         boxShadow="1px 0px 0px rgba(0, 0, 0, 0.15)"
         minH="100vh"
      >
         <Flex p="16px" justifyContent="center" alignItems="center">
            <FcLock
               style={{
                  height: "1.6rem",
                  width: "1.6rem",
               }}
            />
            <Link to="/">
               <Heading
                  fontSize="19px"
                  color="#A4A6B3"
                  letterSpacing="0.4px"
                  ml="8px"
               >
                  Cifrado
               </Heading>
            </Link>
         </Flex>
         <Box textAlign="left" w="255px" p="16px" display="table">
            <Box display="table-row">
               <Box h="56px" display="table-cell" verticalAlign="middle">
                  <Link to="text-encryption">
                     <Heading
                        fontSize="16px"
                        fontStyle="normal"
                        fontWeight="medium"
                        letterSpacing="0.2px"
                        color="#DDE2FF"
                     >
                        Text Encryption
                     </Heading>
                  </Link>
               </Box>
            </Box>

            <Box display="table-row">
               <Box h="56px" display="table-cell" verticalAlign="middle">
                  <Heading
                     fontSize="16px"
                     fontStyle="normal"
                     letterSpacing="0.2px"
                     fontWeight="medium"
                     color="#DDE2FF"
                  >
                     <Link to="text-decryption">Text Decryption</Link>
                  </Heading>
               </Box>
            </Box>

            <Box display="table-row">
               <Box h="56px" display="table-cell" verticalAlign="middle">
                  <Heading
                     fontSize="16px"
                     fontStyle="normal"
                     letterSpacing="0.2px"
                     fontWeight="medium"
                     color="#DDE2FF"
                  >
                     <Link to="file-encryption">File Encryption</Link>
                  </Heading>
               </Box>
            </Box>

            <Box display="table-row">
               <Box h="56px" display="table-cell" verticalAlign="middle">
                  <Heading
                     fontSize="16px"
                     fontStyle="normal"
                     letterSpacing="0.2px"
                     fontWeight="medium"
                     color="#DDE2FF"
                  >
                     <Link to="file-decryption">File Decryption</Link>
                  </Heading>
               </Box>
            </Box>

            <Box display="table-row">
               <Box h="56px" display="table-cell" verticalAlign="middle">
                  <Heading
                     fontSize="16px"
                     fontStyle="normal"
                     letterSpacing="0.2px"
                     fontWeight="medium"
                     color="#DDE2FF"
                  >
                     <Link to="audio-encryption">Audio Encryption</Link>
                  </Heading>
               </Box>
            </Box>
         </Box>
      </Box>
   );
};

export default Menubar;
