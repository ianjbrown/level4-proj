import { useState } from "react";
import { Alert, Container, Form, Button } from "react-bootstrap";
import MainNavigaton from "../components/layout/MainNavigation";
import Centered from "../components/ui/Centered";

function ContactPage() {
  const FORM_ENDPOINT =
    "https://public.herotofu.com/v1/755bbcc0-90a6-11ec-8462-6960be7ce578";
  const [submitted, setSubmitted] = useState(false);

  function submitHandler() {
    setTimeout(() => {
      setSubmitted(true);
    }, 100);
  }
  //   if (submitted) {
  //     return (
  //       <>
  //         <h2>Thank you!</h2>
  //         <div>Your feedback is greatly appreciated.</div>
  //       </>
  //     );
  //   }

  return (
    <>
      <MainNavigaton />
      <Container fluid className="pt-5">
        <Centered>
          {submitted && (
            <Alert variant="success">Thank you for your feedback!</Alert>
          )}
          <h1>Evaluation</h1>
          <div style={{ marginTop: "15px", marginBottom: "40px" }}>
            <p>
              I am currently collecting feedback on this application. If you
              have a few minutes please visit the link below and complete the Google 
              form. I would greatly appreciate it!
            </p>
            <p><a href="https://google.com">Link to Google Form.</a></p>
          </div>
          <h1>Contact</h1>
          <p style={{ marginTop: "15px" }}>
            If you have any further comments about the application,
            please complete the short form below.
          </p>
          <Form
            action={
              "https://public.herotofu.com/v1/755bbcc0-90a6-11ec-8462-6960be7ce578"
            }
            method="POST"
            onSubmit={submitHandler}
            target="_blank"
          >
            <Form.Group className="mb-3">
              <Form.Label>Name:</Form.Label>
              <Form.Control placeholder="Name" name="name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                placeholder="name@example.com"
                type="email"
                name="email"
              ></Form.Control>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Your Message:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter message here..."
                name="message"
              />
            </Form.Group>
            <Form.Group>
              <Button className="mt-2" variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
          </Form>
        </Centered>
      </Container>
    </>
  );
}

export default ContactPage;