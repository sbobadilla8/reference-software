import { useState } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../utils/api";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
   Alert,
   AlertIcon,
   Input,
   VStack,
   Button,
   Select,
   Heading,
   Container,
   FormLabel,
   FormControl,
   FormErrorMessage,
   useToast,
} from "@chakra-ui/react";

const schema = yup
   .object({
      file: yup.mixed().required("Debe seleccionar un archivo"),
      type: yup.string().required("Debe seleccionar una opción"),
   })
   .required();

function FileEncryption() {
   const history = useHistory();
   const toast = useToast();

   const {
      watch,
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(schema),
   });

   const type = watch("type");

   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [filepath, setFilepath] = useState(null);

   function goBack() {
      history.push("/");
   }

   function download() {
      window.location.href = `${api.defaults.baseURL}/download?path=${filepath}`;
   }

   async function onSubmit(data) {
      try {
         setError(null);
         setIsLoading(true);
         if (data.file[0].size <= 10485760) {
            let formData = new FormData();
            formData.append("type", data.type);
            formData.append("file", data.file[0]);
            formData.append("password", data.password);

            let response = await api.post("/encrypt-file", formData);

            setFilepath(response.data);
            toast({
               position: "top-right",
               title: "Encriptación correcta",
               status: "success",
               duration: 1500,
               isClosable: true,
            });
         } else {
            toast({
               position: "top-right",
               title: "Tamaño máximo de archivo 10 MB",
               status: "error",
               duration: 1500,
               isClosable: true,
            });
         }
      } catch (err) {
         console.log("Error", err);
         setError("Error encrypting file");
         toast({
            position: "top-right",
            title: "Error encrypting file",
            status: "error",
            duration: 1500,
            isClosable: true,
         });
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <Container maxW="container.md" py={4}>
         <VStack align="stretch">
            <Button onClick={goBack}>Go Back</Button>

            <Heading>File Encryption</Heading>

            <form onSubmit={handleSubmit(onSubmit)}>
               <VStack align="stretch" spacing={3}>
                  <FormControl isInvalid={!!errors.file}>
                     <FormLabel htmlFor="file">File</FormLabel>
                     <input type="file" {...register("file")} />
                     <FormErrorMessage>{errors.file?.message}</FormErrorMessage>
                     <Alert status="warning" mt={8}>
                        <AlertIcon />
                        Debido a la naturaleza de algunos archivos y el
                        algortimo de encriptado, es posible que el archivo
                        resultante pese más de 15 MB (límite de subida del
                        servidor), por lo que este no podrá ser desencriptado
                     </Alert>
                  </FormControl>

                  <FormControl mb={4} isInvalid={!!errors.type}>
                     <FormLabel htmlFor="type">Type</FormLabel>
                     <Select
                        id="type"
                        {...register("type")}
                        placeholder="Select type"
                     >
                        <option value="AES">AES</option>
                        <option value="ABMV">ABMV</option>
                     </Select>
                     <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
                  </FormControl>

                  {type === "ABMV" && (
                     <FormControl isRequired>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                           id="password"
                           type="password"
                           {...register("password")}
                        />
                     </FormControl>
                  )}

                  <Button type="submit" isLoading={isLoading}>
                     Encrypt
                  </Button>
               </VStack>
            </form>

            <FormControl>
               <FormLabel htmlFor="result">Result</FormLabel>
               <Button id="result" disabled={!filepath} onClick={download}>
                  Download
               </Button>
            </FormControl>
         </VStack>
      </Container>
   );
}

export { FileEncryption };
