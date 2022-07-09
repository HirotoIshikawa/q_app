import React, { useEffect } from "react";

import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import Feed from "./components/Feed";
import Auth from "./components/Auth";

// コンポーネント
const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // ユーザがログインした時など、なんらかの変化した時に呼ばれる
  useEffect(() => {
    // ペイロードで、渡ってきたauthUser
    const unSub = auth.onAuthStateChanged((authUser) => {
      // ユーザが存在すればdispatch経由でユーザ情報を書き込む
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        // authUserがない時ログアウト
        dispatch(logout());
      }
    });
    // Appコンポーネントがアンマウントされた時にクリーンアップ実行
    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
