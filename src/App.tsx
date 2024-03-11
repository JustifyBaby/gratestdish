import React, { useState } from 'react';
import storage from "./firebase";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import './App.css';
import Voice from './Voice';
import { fileAllowUndefined } from './types';

function App() {
  const [imgSrc, setImgSrc] = useState<string>("");
  const fileUpLoader = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: fileAllowUndefined = e.target?.files?.[0];

    if (file == undefined) return;

    const fileName = file.name;
    const storageRef = ref(storage, `images/${fileName}`);

    // eslint-disable-next-line no-console
    uploadBytes(storageRef, file).then(() => console.log("success!")).catch(err => console.error(`${err} is happened.`));
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(url => setImgSrc(url))
          // エラーログは欲しい
          // eslint-disable-next-line no-console
          .catch(err => console.error(err + "is happen."));
      }
    );
  };

  const imgClick = () => {
    const btn = document.getElementById("start");
    btn?.click();
  };

  return (
    <div id='App'>
      <div className="flex">
        <label className='file-label'>
          <input
            type="file"
            accept='.png, .jpg, .jpeg'
            className='fileInput'
            onChange={e => fileUpLoader(e)}
          />
          <p className="file-none">Click Here</p>
        </label>
        <br />
        <img src={imgSrc} alt='まだ、画像がありません。' onClick={imgClick} />
        {(imgSrc === "") ?
          <div className='back-video'>
            <h2 className="left">なぜこのサイトは</h2>
            <h2 className="center">タイトルがGRATEST DISH（ｒｙなのでしょうか？</h2>
            <div className='roll'>? ? ?</div>
            <h2 className="right">最高の夜をお過ごしくださいね！</h2>
          </div> :
          <div className='void'></div>}
        <Voice imgSrc={imgSrc} />
      </div>
    </div>
  );
}

export default App;
