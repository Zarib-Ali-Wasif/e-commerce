import React from "react";
import { Box, Typography, Icon, IconButton } from "@mui/material";
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
          backgroundColor: "#282c34",
          color: "#1C4771",
        }}
      >
        <Box display="flex" justifyContent="center" gap={2}>
          <IconButton>
            <FontAwesomeIcon icon={faInstagram} size="2x" color="#1C4771" />
          </IconButton>
          <IconButton>
            <FontAwesomeIcon icon={faGithub} size="2x" color="#1C4771" />
          </IconButton>
          <IconButton>
            <FontAwesomeIcon icon={faYoutube} size="2x" color="#1C4771" />
          </IconButton>
          <IconButton>
            <FontAwesomeIcon icon={faFacebook} size="2x" color="#1C4771" />
          </IconButton>
        </Box>
        <Typography variant="h6" textAlign="center" mt={5} mb={5}>
          All Rights Reserved © Techinfo YT
        </Typography>
      </Box>
    </>
  );
}

export default Footer;
