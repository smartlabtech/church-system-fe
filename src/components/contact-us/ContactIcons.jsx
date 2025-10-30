import {Box, Stack, Text} from "@mantine/core"
import classes from "./ContactIcons.module.css"
import {FaAt, FaMapPin, FaPhone, FaSun} from "react-icons/fa"

function ContactIcon({icon: Icon, title, description, ...others}) {
  return (
    <div className={classes.wrapper} {...others}>
      <Box mr="md">
        <Icon size={24} />
      </Box>

      <div>
        <Text size="xs" className={classes.title}>
          {title}
        </Text>
        <Text className={classes.description}>{description}</Text>
      </div>
    </div>
  )
}

const MOCKDATA = [
  {title: "Email", description: "hello@mantine.dev", icon: FaAt}
  //   {title: "Phone", description: "+49 (800) 335 35 35", icon: FaPhone},
  //   {title: "Address", description: "844 Morris Park avenue", icon: FaMapPin},
  //   {title: "Working hours", description: "8 a.m. – 11 p.m.", icon: FaSun}
]

export function ContactIconsList() {
  const items = MOCKDATA.map((item, index) => (
    <ContactIcon key={index} {...item} />
  ))
  return <Stack>{items}</Stack>
}
