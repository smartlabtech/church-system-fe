import React from "react"

function FormContainer({children}) {
  return (
    <Container>
      <Group className="justify-content-md-center">
        <Stack xs={12} md={6}>
          {children}
        </Stack>
      </Group>
    </Container>
  )
}

export default FormContainer
