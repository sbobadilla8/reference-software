import { useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { api } from "../utils/api";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
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
      type: yup.string().required("Debe seleccionar una opción"),
   })
   .required();

function AudioEncryption() {
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
   const [audio, setAudio] = useState(null);
   const [isRecording, setIsRecording] = useState(false);
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

         let formData = new FormData();
         formData.append("type", data.type);
         formData.append("file", audio, `${uuidv4()}.mp3`);
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

   async function startRecording() {
      try {
         const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
         });
         const mediaRecorder = new MediaRecorder(stream);
         setIsRecording(true);
         mediaRecorder.start();

         const audioChunks = [];

         mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
         });

         mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            setAudio(audioBlob);
         });

         setTimeout(() => {
            mediaRecorder.stop();
            setIsRecording(false);
            toast({
               position: "top-right",
               title: "Grabación correcta",
               status: "success",
               duration: 1500,
               isClosable: true,
            });
         }, 5000);
      } catch (err) {
         console.log(err);
         toast({
            position: "top-right",
            title: "Error en la grabación",
            status: "error",
            duration: 1500,
            isClosable: true,
         });
      }
   }

   return (
      <Container maxW="container.md" py={4}>
         <VStack align="stretch">
            <Button onClick={goBack}>Go Back</Button>

            <Heading>Audio Encryption</Heading>

            <form onSubmit={handleSubmit(onSubmit)}>
               <VStack align="stretch" spacing={3}>
                  <Button disabled={isRecording} onClick={startRecording}>
                     Record
                  </Button>

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
                        <Input id="password" {...register("password")} />
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

export { AudioEncryption };
