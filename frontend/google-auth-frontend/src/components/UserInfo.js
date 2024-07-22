import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";

const UserInfo = ({ user }) => {
  return (
    <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={user.picture}
            alt={user.name}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Typography variant="h5">{user.name}</Typography>
        </Box>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">
          Email Verified: {user.email_verified ? "Yes" : "No"}
        </Typography>
        <Typography variant="body1">User ID: {user.sub}</Typography>
        <Typography variant="body1">Given Name: {user.given_name}</Typography>
        <Typography variant="body1">Family Name: {user.family_name}</Typography>
        <Typography variant="body1">
          Locale: {user.locale || "Not specified"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
