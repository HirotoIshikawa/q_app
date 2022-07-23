import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface USER {
  displayName: string;
  photoUrl: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      uid: "",
      photoUrl: "",
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
      state.user = { uid: "", photoUrl: "", displayName: "" };
    },
    // プロフのアプデ用
    updateUserProfile: (state, action: PayloadAction<USER>) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

// REACTのコンポーネントからuseSelecterでREDUXのステートを参照するために使用する関数
export const selectUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
