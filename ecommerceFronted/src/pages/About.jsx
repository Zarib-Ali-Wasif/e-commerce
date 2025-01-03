import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { Toolbar } from "@mui/material";

function About() {
  return (
    <>
      <Toolbar />
      <Box>
        <Box mt={10} mb={10} p={3} sx={{ minHeight: "100vh", height: "100%" }}>
          <Typography variant="h4" textAlign="center">
            Welcome to{" "}
            <strong>
              <span style={{ color: "#1C4771", fontSize: "2.5rem" }}>
                ShopEasy
              </span>
            </strong>
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            textAlign="justify"
            color="textSecondary"
          >
            At <strong>ShopEasy</strong>, we redefine your shopping experience
            by bringing quality products and unbeatable deals right to your
            fingertips. Our mission is to provide a seamless and enjoyable
            shopping journey, offering a wide range of products from trusted
            brands, carefully curated to meet your every need.
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            textAlign="justify"
            color="textSecondary"
          >
            Whether you're looking for the latest gadgets, trendy fashion, home
            essentials, or unique gift ideas, <strong>ShopEasy</strong> has it
            all. Our commitment to quality ensures that every product in our
            catalog meets the highest standards, giving you the confidence to
            shop with ease.
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            textAlign="justify"
            color="textSecondary"
          >
            We believe that shopping should be more than a transaction—it’s a
            connection. That’s why we focus on delivering exceptional customer
            service, quick delivery, and a user-friendly platform that makes
            browsing and buying a breeze. Our team is dedicated to ensuring your
            satisfaction every step of the way.
          </Typography>
          <Typography
            variant="body1"
            mt={2}
            textAlign="justify"
            color="textSecondary"
          >
            Thank you for choosing <strong>ShopEasy</strong>. Explore our
            collections, discover incredible savings, and enjoy a shopping
            experience that’s tailored just for you. Your journey to finding the
            perfect products begins here, and we’re thrilled to have you as part
            of our community.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default About;
