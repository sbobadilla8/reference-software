import React from "react";
import { Box, Container, Heading, Image, Text, VStack } from "@chakra-ui/react";
function Home() {
   const alumnos = [
      {
         id: 1,
         nombre: "Giancarlo Paolo Agostinelli Rondón",
         codigo: "2017203771",
      },
      {
         id: 2,
         nombre: "Sebastián Gonzalo Bobadilla Chara",
         codigo: "2017204541",
      },
      {
         id: 3,
         nombre: "Diego Gonzalo Mendoza Pinto",
         codigo: "2017223121",
      },
      {
         id: 4,
         nombre: "Marcelo Ernesto Valdivia Vizcarra",
         codigo: "2017803111",
      },
   ];
   return (
      <Container maxW="container.md" py={8} textAlign="center">
         <VStack align="stretch" spacing={8}>
            <Heading>Universidad Católica de Santa María</Heading>
            <Image
               src="https://ibas.ucsm.edu.pe/UCSMPWA/static/media/logo_ucsm.845b51ec.svg"
               h="16rem"
            />
         </VStack>
         <VStack mb={16} spacing={4}>
            <Text fontSize="28px">
               Facultad de Ciencias e Ingenierías Físicas y Formales
            </Text>
            <Text fontSize="20px">
               Escuela Profesional de Ingeniería de Sistemas
            </Text>
            <Text fontSize="24px">Seguridad de la Información</Text>
            <Heading fontSize="28px" fontWeight="medium">
               Plataforma de Cifrado
            </Heading>
         </VStack>
         {alumnos.map((alumno) => (
            <Box textAlign="right" key={alumno?.id}>
               <Text fontSize="18px">
                  {alumno?.nombre} - {alumno?.codigo}
               </Text>
            </Box>
         ))}
         <Box mt={16}>
            <Text fontSize="18px">Arequipa - Perú</Text>
            <Text fontSize="18px">2021</Text>
         </Box>
      </Container>
   );
}

export { Home };
