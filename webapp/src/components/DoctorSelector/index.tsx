import { Doctor } from '@/generated/core.graphql'
import { Avatar, Box, Heading, Stack, Text } from '@chakra-ui/react'
import { FC } from 'react'



const DoctorSelector: FC<{
  doctors: Doctor[];
  value?: Doctor;
  onChange: (doc: Doctor | undefined) => void;
}> = ({ doctors, value, onChange }) => {
  return (
    <Box marginTop={6}>
      <Heading as='h2' size='lg'>
        Select Doctor
      </Heading>

      {!doctors || doctors.length === 0 ? (
        <Text>No doctors</Text>
      ) : (
        <Stack direction='row' marginTop={2} marginBottom={2}>
          {
            doctors.map((doc) => {
              const selected = doc===value;
              return (
                <Avatar key={doc.id} name={doc.name.split('_').join(' ')} borderColor='lime' borderWidth={selected? 1 : 0} onClick={() => onChange(doc)}/>
              )
            })
          }
        </Stack>
      )}
      {value && <Text>You select: {value.name.split('_').join(' ').toLocaleUpperCase()}</Text>}
    </Box>
  );
};

export default DoctorSelector;
