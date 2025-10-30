import React from "react"
import {Container, Accordion, Code, Title, Text, Tabs} from "@mantine/core"

const ApiDocumentation = () => {
  return (
    <Container size="md">
      <Title order={2} align="center" mt="md" mb="md">
        API Documentation
      </Title>

      <Accordion>
        {/* API Endpoint */}
        <Accordion.Item value="get-users">
          <Accordion.Control>GET /api/users</Accordion.Control>
          <Accordion.Panel>
            <Text weight={500} mt="xs">
              Description:
            </Text>
            <Text>Fetch a list of users from the database.</Text>

            <Text weight={500} mt="md">
              Request:
            </Text>
            <Code block>{`GET /api/users`}</Code>

            <Text weight={500} mt="md">
              Response:
            </Text>
            <Code block>
              {`{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "johndoe@example.com"
    },
    {
      "id": 2,
      "name": "Jane Doe",
      "email": "janedoe@example.com"
    }
  ]
}`}
            </Code>

            <Text weight={500} mt="md">
              Usage Examples:
            </Text>
            <Tabs defaultValue="python">
              <Tabs.List>
                <Tabs.Tab value="python">Python</Tabs.Tab>
                <Tabs.Tab value="javascript">JavaScript</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="python">
                <Code block language="python">
                  {`import requests

url = "https://api.example.com/users"
response = requests.get(url)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}")`}
                </Code>
              </Tabs.Panel>

              <Tabs.Panel value="javascript">
                <Code block language="javascript">
                  {`const fetchUsers = async () => {
  const response = await fetch('https://api.example.com/users');
  if (response.ok) {
    const data = await response.json();
    console.log(data);
  } else {
    console.error('Error:', response.status);
  }
};

fetchUsers();`}
                </Code>
              </Tabs.Panel>
            </Tabs>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}

export default ApiDocumentation
