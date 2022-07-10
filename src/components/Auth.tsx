import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { auth, provider, storage } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
  FormControlLabel,
  Link,
  Checkbox,
  createTheme,
  ThemeProvider,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import CameraIcon from "@mui/icons-material/Camera";
import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { classes } from "istanbul-lib-coverage";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ログイン状態か否かを保持 初期値はログインモードtrue
  const [isLogin, setIsLogin] = useState(true);

  const signInWithEmail = async () => {
    // ステートで管理しているemailとpasswordが入る
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider).catch((err) => alert(err.message));
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // 左側ペインの画像
            backgroundImage:
              "url(https://images.unsplash.com/photo-1621416953228-87ad15716483?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {/* isLoginの値で表示を変更*/}
              {isLogin ? "Login" : "Register"}
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                // emailステートをvalueに割り当て
                value={email}
                // 文字が入力されたらsetEmailを呼び出し、ステートに反映
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                // passwordステートをvalueに割り当て
                value={password}
                // 文字が入力されたらsetPasswordを呼び出し、ステートに反映
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<EmailIcon />}
                onClick={
                  isLogin
                    ? async () => {
                        // ログインモード
                        try {
                          await signInWithEmail();
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }
                    : async () => {
                        // サインインモード
                        try {
                          await signUpWithEmail();
                        } catch (err: any) {
                          alert(err.massage);
                        }
                      }
                }
              >
                {/* isLoginでボタンの文言を変更*/}
                {isLogin ? "Login" : "Register"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <span className={styles.login_reset}>Forgot password?</span>
                </Grid>
                <Grid item xs>
                  {/*クリックされると、ログインモードとサインインモードを切り替える*/}
                  <span
                    className={styles.login_toggleMode}
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Create new account ?" : "Back to login"}
                  </span>
                </Grid>
              </Grid>

              {/*  Googleでログイン */}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={signInWithGoogle}
              >
                SignIn with Google
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default Auth;
