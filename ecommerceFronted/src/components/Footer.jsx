import React from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faGithub,
  faYoutube,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          padding: 2,
          backgroundColor: "#dfe5f2",
          color: "#1C4771",
        }}
      >
        {/* Social Media Icons */}
        <Grid
          container
          justifyContent="center"
          spacing={2}
          sx={{
            mb: 2,
          }}
        >
          <Grid item xs={2} sm={0.8} md={0.6}>
            <IconButton>
              <FontAwesomeIcon
                icon={faInstagram}
                style={{ fontSize: "1.5rem", color: "#1C4771" }}
              />
            </IconButton>
          </Grid>
          <Grid item xs={2} sm={0.8} md={0.6}>
            <IconButton>
              <FontAwesomeIcon
                icon={faGithub}
                style={{ fontSize: "1.5rem", color: "#1C4771" }}
              />
            </IconButton>
          </Grid>
          <Grid item xs={2} sm={0.8} md={0.6}>
            <IconButton>
              <FontAwesomeIcon
                icon={faYoutube}
                style={{ fontSize: "1.5rem", color: "#1C4771" }}
              />
            </IconButton>
          </Grid>
          <Grid item xs={2} sm={0.8} md={0.6}>
            <IconButton>
              <FontAwesomeIcon
                icon={faFacebook}
                style={{ fontSize: "1.5rem", color: "#1C4771" }}
              />
            </IconButton>
          </Grid>
        </Grid>

        {/* Footer Text */}
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" }, // Font size adapts based on grid
          }}
        >
          All Rights Reserved © Techinfo YT
        </Typography>
      </Box>
    </>
  );
}

export default Footer;
