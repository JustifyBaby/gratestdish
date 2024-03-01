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

  return (
    <div>
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
        <img src={imgSrc} alt='まだ、画像がありません。' />
        <Voice imgSrc={imgSrc} />
      </div>
    </div>
  );
}

export default App;