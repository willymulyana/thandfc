import { Doctor, Slot, useSlotsQuery } from '@/generated/core.graphql'
import { CheckIcon } from '@chakra-ui/icons'
import { Box, Button, Center, Flex, FlexProps, Heading, Progress, Text, useColorMode, Wrap, WrapItem } from '@chakra-ui/react'
import { format, isEqual, isSameDay, parseISO } from 'date-fns'
import moment from 'moment'
import { FC, useEffect, useState } from 'react'
import { DayPickerSingleDateController } from 'react-dates'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'


type Props = {
  selectedDoctor?: Doctor,
  minimumStartDate: Date;
  maximumStartDate: Date;
  styleProps?: FlexProps;
}

const SlotSelector: FC<Props> = ({
  selectedDoctor,
  minimumStartDate,
  maximumStartDate,
  styleProps,
  ...props
}) => {
  const { data, loading } = useSlotsQuery({
    variables: {
      from: minimumStartDate,
      to: maximumStartDate
    }
  });

  const { toggleColorMode, colorMode } = useColorMode();

  const [date, setDate] = useState(
    data?.slots[0]?.start || minimumStartDate,
  );
  const [availableSlotsOnDate, setAvailableSlotsOnDate] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot>();

  const minStartDate = moment(minimumStartDate);
  const maxStartDate = moment(maximumStartDate);

  useEffect(() => {
    if (selectedDoctor && data?.slots && date) {
      let availableSlots:Slot[] = [];//data.slots[0]];
      data.slots.map((slot)=>{
        if(selectedDoctor.id===slot.doctorId && isSameDay(parseISO(date.toISOString()),parseISO(slot.start))) {
          availableSlots.push(slot);
        }
      });
      setAvailableSlotsOnDate(availableSlots);
    }
  }, [selectedDoctor, data, date]);

  useEffect(() => {
    if(selectedSlot) {
      // TODO: show booking appointment form popup
    }
  }, [selectedSlot]);

  return (
    <Box marginTop={6}>
      <Heading as='h2' size='lg'>
        Select Slot
      </Heading>
      <Center boxShadow='2xl' marginTop={2}>
        <Wrap >
          <WrapItem w="350px" maxHeight='300px'>
              <DayPickerSingleDateController
                initialVisibleMonth={() => moment(date)}
                onFocusChange={() => null}
                date={moment(date)}
                focused
                hideKeyboardShortcutsPanel
                isDayBlocked={(d) => {
                  const isBlocked =
                    d.startOf('day') < minStartDate.startOf('day') ||
                    d.endOf('day') > maxStartDate.endOf('day');
                  return isBlocked;
                }}
                onDateChange={(d) => {
                  if (d) {
                    setDate(d.toDate());
                  }
                }}
                {...props}
              />
          </WrapItem>
          <WrapItem w="350px" maxHeight='300px'>
            <Flex flexDirection="column" padding="6" bg="white" color="black" >
              <Text width="100%" fontSize="17px" textAlign="left" fontWeight="bold" color="#484848">
                {format(date, 'eeee, MMMM dd')}
              </Text>
              <Box maxH="250px" overflow="scroll" position="relative">
                {loading ? (
                  <Progress />
                ) : (
                  availableSlotsOnDate.length===0 ? (
                    <Text width="100%" fontSize="12px" mb="20px" mt="22px" textAlign="left">
                      No available slot
                    </Text>
                  ) : (
                    availableSlotsOnDate.map((slot) => {
                      const isActive = selectedSlot && isEqual(parseISO(selectedSlot.start), parseISO(slot.start));
                      const activeStyle = isActive && {
                        backgroundColor: 'teal.500',
                        border: 'none',
                      };
                      return (
                        <Button
                          key={slot.start.toString()}
                          _hover={{
                            backgroundColor: 'white.10',
                          }}
                          borderColor={colorMode==='light'?"white.10":'black'}
                          color={colorMode==='light'?"white.10":'black'}
                          fontSize="16px"
                          mb="8px"
                          onClick={() => setSelectedSlot(slot)}
                          py="16px"
                          variant="outline"
                          width="100%"
                          {...activeStyle}
                        >
                          {format(parseISO(slot.start), 'h:mm a')}{' '}
                          {isActive && <CheckIcon position="absolute" right="18px" />}
                        </Button>
                      );
                    })
                  )
                )}
              </Box>
            </Flex>
          </WrapItem>
        </Wrap>
      </Center>
    </Box>
    
  );
};

export default SlotSelector;
