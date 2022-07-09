import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      uid: "",
      photoURL: "",
      displayName: "",
    },
  },

  reducers: {
    // ログイン時に受け取ったfirebaseからの情報をreduxのuserステートに保存
    login: (state, action) => {
      state.user = action.payload;
    },
    // ロウグアウト時はuserステートを初期化
    logout: (state) => {
      state.user = { uid: "", photoURL: "", displayName: "" };
    },
  },
});

export const { login, logout } = userSlice.actions;

// REACTのコンポーネントからuseSelecterでREDUXのステートを参照するために使用する関数
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
