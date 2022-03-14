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
} from "@chakra-ui/react";

const schema = yup
   .object({
      text: yup.string().required("Este campo es necesario"),
      type: yup.string().required("Debe seleccionar una opción"),
   })
   .required();

function TextEncryption() {
   const history = useHistory();

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
         let response = await api.post("/encrypt-text", formData);
         setResult(response.data);
      } catch {
         console.log("Error");
         setError("Error encrypting text");
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <Container maxW="container.md" py={4}>
         <VStack align="stretch">
            <Button onClick={goBack}>Go Back</Button>
            <Heading>Text Encryption</Heading>

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
                     Encrypt
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

export { TextEncryption };
