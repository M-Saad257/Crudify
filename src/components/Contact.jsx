import React from 'react';
import { useForm } from 'react-hook-form';
import emailjs from 'emailjs-com'; // ← Add this import

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const serviceID = 'qwertr2009';       // Replace with your EmailJS Service ID
    const templateID = 'template_g90io0r';     // Replace with your EmailJS Template ID
    const userID = 'DaklfxMHkTJ3ZswYp';          // Replace with your EmailJS Public Key

    const templateParams = {
      user_name: data.name,
      user_email: data.email,
      message: data.message,
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, userID);
      alert("Message sent successfully!");
      reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <section id='contact' className="contact-section">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
        <label>Name</label>
        <input
          type="text"
          {...register('name', { required: "Name is required" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <label>Email</label>
        <input
          type="email"
          {...register('email', {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <label>Message</label>
        <textarea
          {...register('message', { required: "Message is required" })}
        />
        {errors.message && <p className="error">{errors.message.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
};

export default Contact;
