import DoctorSelector from '@/components/DoctorSelector'
import SlotSelector from '@/components/SlotSelector'
import { Doctor, useDoctorsQuery } from '@/generated/core.graphql'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, IconButton, Text, useColorMode } from '@chakra-ui/react'
import { addDays, addHours, startOfMinute } from 'date-fns'
import { useState } from 'react'


const Appointments = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  
  const { data, loading} = useDoctorsQuery();
  const [error, setError] = useState<string>();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  
  const minimumStartDate = startOfMinute(addHours(new Date(),1)); //at least for next hour
  const maximumStartDate = minimumStartDate && addDays(minimumStartDate, 30);

  return (
    <Box>
      <Flex padding='4' height='60px' width='100%' backgroundColor='teal.500' alignItems='center' justifyContent='flex-end'>
        <IconButton
          aria-label="toggle theme"
          rounded="full"
          size="md"
          onClick={toggleColorMode} icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
        />
      </Flex>
      <Heading as='h1' size='3xl' backgroundColor='teal.400' paddingLeft='4' color={'white'}>Appointments</Heading>
      <Box m={4} height='100vh'>
        
        {error && (
          <Box>
            <Text>{error}</Text>
          </Box>
        )}
        <DoctorSelector
          doctors={data?.doctors as Doctor[]}
          value={selectedDoctor}
          onChange={setSelectedDoctor}
        />
        {selectedDoctor && (
          <SlotSelector
            selectedDoctor={selectedDoctor}
            minimumStartDate={minimumStartDate}
            maximumStartDate={maximumStartDate}
          />
        )}
      </Box>
    </Box>
  );
};

export default Appointments;
