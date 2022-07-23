import React, { useState } from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
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
  styled,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import CameraIcon from "@mui/icons-material/Camera";
import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { classes } from "istanbul-lib-coverage";
import { style } from "@mui/system";
import { ThermostatAuto } from "@mui/icons-material";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ログイン状態か否かを保持 初期値はログインモードtrue
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // アバター画像の設定処理
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 一つのファイルを選択し
    if (e.target.files![0]) {
      // ステートに保存
      setAvatarImage(e.target.files![0]);
      // 複数ファイル選択時に、毎回呼ばれるのを防ぐため
      e.target.value = "";
    }
  };

  const signInWithEmail = async () => {
    // ステートで管理しているemailとpasswordが入る
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async () => {
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    let url = "";

    //アバター画像がある時
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      // 16桁のランダム文字列を生成
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;

      // fireStorageに保存
      const storageRef = ref(storage, `avaters/${fileName}`);
      // アップロード
      await uploadBytes(storageRef, avatarImage);
      // アップロードした画像のURLを取得
      url = await getDownloadURL(ref(storage, `avaters/${fileName}`));
    }
    //authUser.userが存在する場合
    if (authUser.user) {
      // fireBaseで持っている情報を更新
      await updateProfile(authUser.user, {
        displayName: username,
        photoURL: url,
      });
    }

    dispatch(
      // reduxのuserステートにfirebaseに登録した情報と同じものを渡す
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider).catch((err) => alert(err.message));
  };

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((error) => {
        alert(error.message);
        setResetEmail("");
      });
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
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {/* registerモードの場合username入力エリアを表示*/}
              {!isLogin && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    // emailステートをvalueに割り当て
                    value={username}
                    // 文字が入力されたらsetUsernameを呼び出し、ステートに反映
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <Box textAlign="center">
                    <IconButton>
                      <label>
                        <AccountCircleIcon
                          fontSize="large"
                          className={
                            avatarImage
                              ? styles.login_addIconLoaded
                              : styles.login_addIcon
                          }
                        />
                        <input
                          className={styles.login_hiddenIcon}
                          type="file"
                          onChange={onChangeImageHandler}
                        />
                      </label>
                    </IconButton>
                  </Box>
                </>
              )}

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
                disabled={
                  isLogin
                    ? !email || password.length < 6
                    : !username || !email || password.length < 0 || !avatarImage
                }
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
                  <span
                    className={styles.login_reset}
                    onClick={() => setOpenModal(true)}
                  >
                    Forgot password?
                  </span>
                </Grid>
                <Grid item>
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
                startIcon={<CameraIcon />}
                onClick={signInWithGoogle}
              >
                SignIn with Google
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box
                style={getModalStyle()}
                sx={{
                  outline: "none",
                  position: "absolute",
                  width: 400,
                  borderRadius: 5,
                  backgroundColor: "white",
                  boxShadow: theme.shadows[5],
                  padding: theme.spacing(10),
                }}
              >
                <Box className={styles.login_modal}>
                  <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="email"
                    name="email"
                    label="Reset E-mail"
                    value={resetEmail}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setResetEmail(e.target.value);
                    }}
                  />
                  <IconButton onClick={sendResetEmail}>
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default Auth;
