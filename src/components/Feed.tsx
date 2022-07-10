import React from "react";
import { auth } from "../firebase";

function Feed() {
  return (
    <div>
      Success!
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
}

export default Feed;
