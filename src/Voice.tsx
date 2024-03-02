import React, { ChangeEvent, useState } from 'react';
import storage from "./firebase";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { fileAllowUndefined } from './types';
import src from "./audio/kya.mp3";

type Props = {
  imgSrc: string;
}

const Voice = ({ imgSrc }: Props) => {
  const [audioSrc, setAudioSrc] = useState<string>("");

  const audioUploader = (e: ChangeEvent<HTMLInputElement>) => {
    const audio: fileAllowUndefined = e.target?.files?.[0];

    if (audio == undefined) return;

    const name = audio?.name;
    const storageRef = ref(storage, `sounds/${name}`);
    // eslint-disable-next-line no-console
    uploadBytes(storageRef, audio).then(() => console.log("Success At Audio.")).catch((err) => console.error(`Failed because ${err}`));
    const uploadTask = uploadBytesResumable(storageRef, audio);

    uploadTask.on("state_changed", () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then(url => setAudioSrc(url))
        // エラーログは欲しい
        // eslint-disable-next-line no-console
        .catch(err => console.error(err + "is happen."));
    });
  };

  const sound = audioSrc ? new Audio(audioSrc) : new Audio(src);
  const soundLoop = (isLoop: boolean) => {
    if (sound === null) return;
    sound.play();
    sound.onended = () => {
      if (isLoop) { soundLoop(true); } else { return; }
    };
  };

  return (imgSrc === "") ?
    (
      <div className='prevUpload'> 画像をアップロードで解放。</div>
    ) : (
      <div className='eroList'>
        <label className='file-label'>
          <input
            type="file"
            accept='.mp3, .wav'
            className='fileInput'
            onChange={e => audioUploader(e)}
          />
          <p className="file-none">音声のアップロード</p>
        </label>

        <div className="audio-handler">
          <button onClick={() => { soundLoop(true); }}>再生</button>
          <button onClick={() => sound ? sound.pause() : null}>一時停止</button>
        </div>
      </div >
    );
};

export default Voice;