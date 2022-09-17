import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { Avatar, Button, IconButton } from "@mui/material";
import firebase from "firebase/app";
import AddPhotoIcon from "@mui/icons-material/AddAPhoto";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const TweetInput:React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  // Tweet画像の設定処理
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 一つのファイルを選択し
    if (e.target.files![0]) {
      // ステートに保存
      setTweetImage(e.target.files![0]);
      // 複数ファイル選択時に、毎回呼ばれるのを防ぐため
      e.target.value = "";
    }
  };

  const sendTweet = async (e: React.FormEvent<HTMLFormElement>) => {
    // submitされた時に画面が更新されるのを防ぐ
    e.preventDefault();

    if (tweetImage) {
      // 画像がある場合は画像をfirestoreにまず保存
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      // 16桁のランダム文字列を生成
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      // fireStorageの参照を取得
      const storageRef = ref(storage, `tweetImages/${fileName}`);
      // アップロード
      //await uploadBytes(storageRef, tweetImage);
      const uploadTask = uploadBytesResumable(storageRef, tweetImage);

      // アップロード状況を監視
      await uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          alert(error.message);
        },
        async () => {
          // 画像アップロード完了後画像URLを取得
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            post(downloadURL);
          });
        }
      );
    } else {
      post("");
    }
  };

  const post = async (imageUrl: String) => {
    // postするデータ
    const postData = {
      avatar: user.photoUrl,
      imageUrl: imageUrl,
      text: tweetMsg,
      timestamp: serverTimestamp(),
      username: user.displayName,
      uid: user.uid,
    };
    // postsコレクション内のドキュメントIDを取得
    const postsCollectionRef = doc(collection(db, "posts"));
    // dbに登録
    await setDoc(postsCollectionRef, postData);

    // 入力内容を初期化
    setTweetImage(null);
    setTweetMsg("");
  };

  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweer_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          <input
            className={styles.tweet_input}
            placeholder="What's happning"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <Button
          type="submit"
          disabled={!tweetMsg}
          className={
            tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
          }
        >
          Tweet
        </Button>
      </form>
    </>
  );
};

export default TweetInput;
