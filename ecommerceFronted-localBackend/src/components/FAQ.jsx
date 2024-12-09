import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
function FAQ() {
  const faqs = [
    {
      question: "What is the best way to contact customer support?",
      answer:
        "You can contact our customer support team via chat, email, or WhatsApp. Our 24/7 support ensures we are always available for your assistance.",
    },
    {
      question: "How long does it take to get a response?",
      answer:
        "We typically respond within 24 hours for email inquiries. For live chat and WhatsApp, our response is instant during working hours.",
    },
    {
      question: "What are your customer service hours?",
      answer:
        "Our customer service is available 24/7 for chat and email support. For WhatsApp, we operate Monday to Friday, 9:00 AM - 6:00 PM.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes, you can track your order through our website. Just navigate to the 'Track Order' section and enter your order details.",
    },
    {
      question: "Can I cancel or change my order?",
      answer:
        "You can cancel or make changes to your order by contacting our customer service team. Please note that we may not be able to make changes once the order has been processed.",
    },
    {
      question: "What if I receive a damaged or defective item?",
      answer:
        "If you receive a damaged or defective item, please contact our customer service team immediately. We will work with you to resolve the issue.",
    },
    {
      question: "How do I return an item?",
      answer:
        "To return an item, please contact our customer service team for a return merchandise authorization (RMA) number. You will need to provide the RMA number with your return.",
    },
    {
      question: "How long does it take for my refund to process?",
      answer:
        "Refunds typically take 3-5 business days to process after we receive the returned item.",
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#d1dce8",
      }}
    >
      <Box
        sx={{
          // pt: 8,
          //   maxWidth: 800,
          width: {
            xs: "85%",
            sm: "80%",
            md: "70%",
            lg: "60%",
          },
          margin: "auto",
          pb: 18,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#1C4771"
          textAlign={"center"}
          mb={6}
        >
          Customer Care FAQs
        </Typography>
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`faq${index + 1}-content`}
              id={`faq${index + 1}-header`}
            >
              <Typography color="#333" fontWeight="bold">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="#333">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}

export default FAQ;
