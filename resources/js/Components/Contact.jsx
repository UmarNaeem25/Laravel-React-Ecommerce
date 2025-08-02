import React from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import axios from '../axios';
import Swal from 'sweetalert2';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';

const Contact = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    const formattedPhone = data.phone.startsWith('+') ? data.phone : `+${data.phone}`;
    if (!isValidPhoneNumber(formattedPhone)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Phone Number',
        text: 'Please enter a valid phone number.',
      });
      return;
    }

    try {
      await axios.post('/api/inquiry', data);
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Your message has been sent successfully.',
      });
      reset(); // Reset the form
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        minHeight: '100vh',
        padding: '60px 0',
      }}
    >
      <Container>
        <Card
          className="shadow border-0"
          style={{
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Card.Body className="p-5">
            <Row className="justify-content-between">
              <Col md={6} className="mb-4 mb-md-0">
                <h3 className="fw-bold mb-3">Our Office</h3>
                <p><strong>Location:</strong> 123 Main Street, City, Country</p>
                <p><strong>Email:</strong> support@example.com</p>
                <p><strong>Phone:</strong> +1 (123) 456-7890</p>
                <div
                  style={{
                    height: '300px',
                    width: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <iframe
                    title="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0860241740074!2d-122.42177768424885!3d37.77492977975898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085815cae928d15%3A0xe4df9d6bb831c8!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1669562634980!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </Col>

              <Col md={5}>
                <h3 className="fw-bold mb-3 text-center">Contact Us</h3>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      {...register('name')}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      {...register('email')}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Controller
                      control={control}
                      name="phone"
                      rules={{ required: true }}
                      render={({ field: { onChange, value } }) => (
                        <PhoneInput
                          country={'us'}
                          value={value}
                          onChange={onChange}
                          inputProps={{ name: 'phone', required: true }}
                          inputStyle={{
                            width: '100%',
                            borderRadius: '0.375rem',
                            borderColor: '#ced4da',
                          }}
                        />
                      )}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Write your message here..."
                      {...register('message')}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex">
                    <Button type="submit" variant="primary" style={{ width: '50%' }}>
                      Send Message
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Contact;
