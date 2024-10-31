import { useEffect, useState } from "react";
import "./style.css";

const Arrow = ({ children, type, increment, decrement }) => {
  return (
    <div className="flex text-center length">
      <i
        onClick={() => decrement(type)}
        id={`${type}-decrement`}
        className="bi bi-arrow-down me-3"
      ></i>
      <p id={`${type}-length`}>{children}</p>
      <i
        onClick={() => increment(type)}
        id={`${type}-increment`}
        className="bi bi-arrow-up ms-3"
      ></i>
    </div>
  );
};

function App() {
  const [defaultValue, setDefaultValue] = useState({
    breakLength: 5,
    sessionLength: 25,
  });
  const [isSession, setIsSession] = useState(true);
  const [breakLength, setBreakLength] = useState(defaultValue.breakLength);
  const [sessionLength, setSessionLength] = useState(
    defaultValue.sessionLength
  );
  const [seconds, setSeconds] = useState(0);
  const [resumeOrPause, setResumeOrPause] = useState(false);


  useEffect(() => {
    let interval;

    if (resumeOrPause) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          let newSeconds = Number(prevSeconds);

          if (isSession) {
            if (sessionLength === 0 && newSeconds === 0) {
              // Jika sudah di akhir session dan tidak ada detik tersisa
              setIsSession(false);
              setSeconds(0); // Reset ke 0 detik untuk break
              setBreakLength(defaultValue.breakLength);
              handleAudio();
                return 59;
            } else if (newSeconds === 0) {
              // Jika detik mencapai 0, kurangi sessionLength
              if (sessionLength > 0) {
                setSessionLength((prev) => prev - 1);
              }
              return 59; // Reset detik ke 59
            } else {
              return newSeconds - 1; // Kurangi detik
            }
          } else {
            // Di dalam break
            if (breakLength === 0 && newSeconds === 0) {
              // Jika sudah di akhir break dan tidak ada detik tersisa
              setIsSession(true);
              setSeconds(3); // Reset ke 59 detik untuk session
              setSessionLength(defaultValue.sessionLength);
              return 59; // Reset detik ke 59
            } else if (newSeconds === 0) {
              // Jika detik mencapai 0, kurangi breakLength
              if (breakLength > 0) {
                setBreakLength((prev) => prev - 1);
              }
              return 59; // Reset detik ke 59
            } else {
              return newSeconds - 1; // Kurangi detik
            }
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [resumeOrPause, isSession, sessionLength, breakLength]);

  useEffect(() => {
    setBreakLength(defaultValue.breakLength);
    setSessionLength(defaultValue.sessionLength);
  }, [defaultValue]);

  const increment = (type) => {
    if (resumeOrPause) {
      return;
    }
    if (type === "break") {
      if (defaultValue.breakLength > 59) {
        return;
      }
      setDefaultValue({ ...defaultValue, breakLength: breakLength + 1 });
    } else {
      if (defaultValue.sessionLength > 59) {
        return;
      }
      setDefaultValue({ ...defaultValue, sessionLength: sessionLength + 1 });
    }
  };

  const decrement = (type) => {
    if (resumeOrPause) {
      return;
    }
    if (type === "break") {
      if (defaultValue.breakLength < 2) {
        return;
      }
      setDefaultValue({ ...defaultValue, breakLength: breakLength - 1 });
    } else {
      if (defaultValue.sessionLength < 2) {
        return;
      }
      setDefaultValue({ ...defaultValue, sessionLength: sessionLength - 1 });
    }
  };

  const playPause = () => {
    setResumeOrPause(!resumeOrPause);
  };

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setDefaultValue({ breakLength: 5, sessionLength: 25 });
    setSeconds(0);
    setResumeOrPause(false);
  };

  const handleAudio = () => {
    const audio = document.getElementById("beep")
    audio.currentTime = 0;
    audio.play();
  };

  return (
    <main className="position-absolute top-50 start-50 translate-middle">
      <section className="section-lenght d-flex gap-5 mb-3">
        <div id="break-label">
          <p>Break Length</p>
          <Arrow increment={increment} decrement={decrement} type={"break"}>
            {defaultValue.breakLength}
          </Arrow>
        </div>
        <div id="session-label">
          <p>Session Length</p>
          <Arrow increment={increment} decrement={decrement} type={"session"}>
            {defaultValue.sessionLength}
          </Arrow>
        </div>
      </section>

      <section
        id="timer-label"
        className="session d-flex flex-column align-items-center  border-black border rounded"
      >
        {isSession ? (
          <>
            <p>Session</p>
            <p id="session-length">
              <span id="time-left">
                {sessionLength}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </p>
          </>
        ) : (
          <>
            <p>Break</p>
            <p id="break-length">
              <span id="time-left">
                {breakLength}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </p>
          </>
        )}
      </section>
      <section className="session-control d-flex justify-content-center gap-3">
        <div onClick={() => playPause()} id="start_stop" className="d-flex gap-2">
          <i className="bi bi-play-fill"></i>
          <i className="bi bi-pause"></i>
        </div>
        <i
          onClick={() => reset()}
          id="reset"
          className="bi bi-arrow-clockwise"
        ></i>
        <audio id="beep" src="/beep.wav" style={{ display: "none" }}></audio>
      </section>
    </main>
  );
}

export default App;
