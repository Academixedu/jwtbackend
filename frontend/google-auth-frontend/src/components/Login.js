import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import UserInfo from "./UserInfo";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success. Full response:", tokenResponse);
      setIsLoading(true);
      try {
        if (!tokenResponse.access_token) {
          console.error(
            "No access_token received from Google. Full response:",
            tokenResponse
          );
          throw new Error("No access token received from Google");
        }

        console.log(
          "Sending access token to backend:",
          tokenResponse.access_token
        );

        const backendResponse = await axios.post(
          "http://localhost:8080/api/auth/google",
          { token: tokenResponse.access_token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Backend Response:", backendResponse.data);

        // Store the session token
        localStorage.setItem("token", backendResponse.data.token);

        // Set user info state
        setUserInfo(backendResponse.data);

        // Commented out navigation to dashboard
        // navigate("/dashboard");
      } catch (error) {
        console.error("Error during login:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
        // TODO: Show error message to the user
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
      // TODO: Show error message to the user
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3, mb: 4 }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="body1" gutterBottom>
            Sign in to start your interview
          </Typography>
          <Button
            variant="contained"
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            onClick={() => login()}
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? "Signing In..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
      {userInfo && <UserInfo user={userInfo} />}
    </Box>
  );
};

export default Login;
