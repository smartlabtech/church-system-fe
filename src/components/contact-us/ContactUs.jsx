import {
  ActionIcon,
  Button,
  Group,
  SimpleGrid,
  Text,
  TextInput,
  Title
} from "@mantine/core"
import {ContactIconsList} from "./ContactIcons"
import classes from "./ContactUs.module.css"
import {FaInstagram, FaTwitter, FaYoutube} from "react-icons/fa"

const social = [FaTwitter, FaYoutube, FaInstagram]

export function ContactUs() {
  const icons = social.map((Icon, index) => (
    <ActionIcon
      key={index}
      size={28}
      className={classes.social}
      variant="transparent"
    >
      <Icon size={22} stroke={1.5} />
    </ActionIcon>
  ))

  return (
    <div className={classes.wrapper}>
      <SimpleGrid cols={{base: 1, xl: 2}} spacing={50}>
        <div>
          <Title className={classes.title}>Contact us</Title>
          <Text className={classes.description} mt="sm" mb={30}>
            Leave your email and we will get back to you within 24 hours
          </Text>

          <ContactIconsList />

          <Group mt="xl">{icons}</Group>
        </div>
        <div className={classes.form}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            classNames={{input: classes.input, label: classes.inputLabel}}
          />
          <TextInput
            label="Name"
            placeholder="John Doe"
            mt="md"
            classNames={{input: classes.input, label: classes.inputLabel}}
          />
          <Text placeholder="I want to order your goods" />

          <Group justify="flex-end" mt="md">
            <Button className={classes.control}>Send message</Button>
          </Group>
        </div>
      </SimpleGrid>
    </div>
  )
}
