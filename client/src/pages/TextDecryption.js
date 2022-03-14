import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
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
   Textarea,
   Container,
   FormLabel,
   FormControl,
   FormErrorMessage,
   useToast,
} from "@chakra-ui/react";

const schema = yup
   .object({
      text: yup.string().required("Este campo es necesario"),
      type: yup.string().required("Debe seleccionar una opción"),
   })
   .required();

function TextDecryption() {
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

   const [result, setResult] = useState("");
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   function goBack() {
      history.push("/");
   }

   async function onSubmit(formData) {
      try {
         setError(null);
         setIsLoading(true);
         let { data } = await api.post("/decrypt-text", formData);
         setResult(data);
      } catch (err) {
         console.log(err);
         setError("Error encrypting text");
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
            <Heading>Text Decryption</Heading>

            <form onSubmit={handleSubmit(onSubmit)}>
               <VStack align="stretch" spacing={3}>
                  <FormControl isInvalid={!!errors.text}>
                     <FormLabel htmlFor="text">Text</FormLabel>
                     <Textarea id="text" {...register("text")} />
                     <FormErrorMessage>{errors.text?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.type}>
                     <FormLabel htmlFor="type">Type</FormLabel>
                     <Select
                        id="type"
                        {...register("type")}
                        placeholder="Select type"
                     >
                        <option value="RSA">RSA</option>
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
                     Decrypt
                  </Button>
               </VStack>
            </form>

            <FormControl isReadOnly>
               <FormLabel htmlFor="result">Result</FormLabel>
               <Textarea value={result} id="result" />
            </FormControl>
         </VStack>
      </Container>
   );
}

export { TextDecryption };
