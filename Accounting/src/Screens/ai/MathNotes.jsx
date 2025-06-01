import { useRef, useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function mathNotes() {
  const { t } = useTranslation();
  //creating Refernce for Canvas to draw on
  const canvasref = useRef(null);
  //creating a state wo determine if the user is drawing
  const [isDrawing, setIsDrawing] = useState(false);
  //creating a state to reste the canvas
  const [reset, setReset] = useState(false);
  //creating a state to change the font color
  const [color, setColor] = useState("#FFFFFF");
  //creating a state to change the font color
  const [bgcolor, setBgColor] = useState("#000000");
  //creating a state to get and set the result
  const [result, setResult] = useState({});
  //creating a state for variable dictionary like 1=y x=1...
  const [dictOfVars, setVarDic] = useState({});
  //creating a state to render the result on the textbox
  const [textValue, setTextValue] = useState("");

  const [range, setRange] = useState(5);

  //creating a function to clear the canvas by pressing a button
  function resetCanvas() {
    const canvas = canvasref.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  //creating a function to send data to the backend server
  const sendData = async () => {
    const canvas = canvasref.current;
    if (canvas) {
      setTextValue("Please Wait...");
      try {
        const response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_URL_AI}`,
          data: {
            image: canvas.toDataURL("image/png"),
            dict_of_vars: dictOfVars,
          },
        });

        const respon = await response.data;
        console.log(`Response: ${respon}`);

        respon.data.forEach((data) => {
          if (data.assign === true) {
            // dict_of_vars[resp.result] = resp.answer;
            setVarDic({
              ...dictOfVars,
              [data.expr]: data.result,
            });
          }
        });

        respon.data.forEach((data) => {
          setTimeout(() => {
            setResult({
              expression: data.expr,
              answer: data.result,
            });
          }, 200);
        });
      } catch (e) {
        console.log(e);
        setTextValue(`An Error Happend Please Try Again Later`);
      }
    }
  };

  //rendering results
  useEffect(() => {
    if (result) {
      // console.log(`${result.expression} = ${result.answer}`)
      setTextValue(`${result.expression} = ${result.answer}`);
    } else {
      setTextValue(`${result.expression} - ${result.text}`);
    }
  }, [result]);

  //creating a useEfeect hook to initilize the canvas elements
  useEffect(() => {
    const canvas = canvasref.current;
    setTextValue("");
    if (canvas) {
      canvas.add;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //Setting brush type
        ctx.lineCap = "round";
        //setting brush size
        ctx.lineWidth = range;
      }

      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("touchmove", draw);
      return () => {
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("touchmove", draw);
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasref.current;
    canvas.style.background = bgcolor;
    setTextValue("");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        //setting brush size
        ctx.lineWidth = range;
      }
    }
  }, [range, bgcolor, color]);

  //Creating a useEffect hook to activate whenever reset is triggered
  useEffect(() => {
    if (reset) {
      resetCanvas();
      setReset(false);
      setTextValue("");
    }
  }, [reset]);

  //creating a mouse event handler to draw elements on the canvas
  const startDrawing = (e) => {
    e.preventDefault();
    //calling the canvas reference from the use ref
    const canvas = canvasref.current;

    const { clientX, clientY } = e.touches ? e.touches[0] : e;

    const x = clientX;
    const y = clientY - canvas.offsetTop;

    if (canvas) {
      //setting up the canvas and ctx
      canvas.style.background = bgcolor;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        //taking th drawing from the mouse
        ctx.moveTo(x, y);
        setIsDrawing(true);
      }
    }

    // Add the no-scroll class to the body
    document.body.classList.add("no-scroll");
  };

  //creating a function that stops drawing
  const stopDrawing = () => {
    setIsDrawing(false);
    document.body.classList.remove("no-scroll");
  };

  function changeBrushColor(e) {
    setColor(e.target.value);
  }

  function changeBgColor(e) {
    setBgColor(e.target.value);
  }

  function handleRangeIncreaments(e) {
    setRange(e.target.value);
  }

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    
    e.preventDefault();

    const canvas = canvasref.current;

    const { clientX, clientY } = e.touches ? e.touches[0] : e;

    const x = clientX;
    const y = clientY - canvas.offsetTop;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.strokeStyle = color;
        //following the mouse
        ctx.lineTo(x, y);
        //stroke to draw
        ctx.stroke();
      }
    }
  };

  return (
    <StyledWrapper>
      <div className="width-full h-full bg-black">
        <div className="Container">
          <button
            className="funcButton"
            id="Reset"
            onClick={() => setReset(true)}
          >
            {t("reset")}
          </button>
          <div className="settings">
            <div className="colorContainer">
              <div className="SettingsContainer">
                <svg
                  fill={color}
                  height="20px"
                  width="25px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 289 289"
                >
                  <path
                    d="M244.373,79.021c-0.792,2.691-3.022,4.715-5.776,5.246l-41.006,7.911l-13.678,40.098c2.328,2.643,3.569,6.102,3.569,9.901
	V274c0,8.284-6.349,15-14.633,15H97.523c-8.284,0-15.04-6.716-15.04-15V142.177c0-4.231,1.778-8.046,4.596-10.772l-13.16-52.387
	c-0.329,0.012-0.616,0.041-0.946,0.041c-11.763,0-22.286-7.435-26.215-18.501l-0.198-0.592c-7.385-21.441,5.813-49.582,6.377-50.77
	c0.866-1.819,2.43-3.216,4.336-3.871c1.905-0.658,3.995-0.523,5.797,0.379c1.175,0.588,28.86,14.635,36.231,36.034l0.217,0.615
	c4.066,12.176-0.872,25.272-11.188,32.043L101.504,127h24.979V35.479L112.661,11.25c-1.34-2.32-1.257-5.18,0.083-7.5
	S116.643,0,119.322,0h29.445c2.68,0,5.155,1.43,6.495,3.75s1.173,5.18-0.167,7.5l-13.614,23.291V127h28.505l13.548-40.144
	L160.463,51.89c-1.532-2.327-1.647-5.312-0.3-7.75c1.349-2.438,3.947-3.91,6.722-3.871c28.255,0.592,55.061,11.677,75.48,31.215
	C244.393,73.422,245.166,76.33,244.373,79.021z"
                  />
                </svg>
                <input
                  type="color"
                  className="ColorPicker"
                  onChange={changeBrushColor}
                  value={color}
                />
              </div>
              <div className="SettingsContainer">
                <svg
                  fill="#ffffff"
                  height="20px"
                  width="25px"
                  id="BrushSvg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 297.75 297.75"
                >
                  <path
                    d="M260.757,82.845l9.181-14.324c0.328-0.513,0.605-1.045,0.852-1.586c0.205-0.448,0.391-0.902,0.54-1.365
	c0.127-0.394,0.227-0.793,0.314-1.194c0.138-0.639,0.232-1.284,0.269-1.931c0.021-0.351,0.026-0.702,0.018-1.053
	c-0.079-3.157-1.338-6.264-3.701-8.625c-0.056-0.056-0.112-0.112-0.168-0.168c-0.005-0.005-0.01-0.009-0.015-0.014
	c-0.282-0.281-0.577-0.544-0.879-0.794c-0.104-0.086-0.212-0.162-0.318-0.243c-0.209-0.162-0.419-0.321-0.636-0.468
	c-0.129-0.087-0.26-0.167-0.392-0.249c-0.203-0.127-0.407-0.25-0.615-0.364c-0.141-0.077-0.283-0.15-0.426-0.222
	c-0.208-0.104-0.418-0.201-0.63-0.293c-0.146-0.063-0.292-0.125-0.44-0.183c-0.22-0.085-0.442-0.161-0.666-0.234
	c-0.144-0.047-0.287-0.096-0.432-0.138c-0.248-0.071-0.499-0.129-0.75-0.185c-0.123-0.027-0.245-0.061-0.369-0.084
	c-0.375-0.071-0.752-0.127-1.131-0.164c-0.045-0.004-0.091-0.004-0.136-0.008c-0.337-0.029-0.674-0.047-1.012-0.049
	c-0.027,0-0.054-0.004-0.081-0.004c-0.271,0-0.543,0.012-0.814,0.029c-0.029,0.002-0.057,0.001-0.086,0.003
	c-0.332,0.024-0.663,0.063-0.992,0.113c-0.104,0.016-0.206,0.038-0.31,0.057c-0.227,0.04-0.452,0.083-0.677,0.136
	c-0.124,0.029-0.246,0.063-0.369,0.096c-0.205,0.054-0.408,0.113-0.611,0.178c-0.127,0.041-0.253,0.084-0.379,0.129
	c-0.2,0.071-0.397,0.149-0.594,0.23c-0.121,0.05-0.242,0.099-0.361,0.154c-0.211,0.095-0.419,0.2-0.626,0.308
	c-0.1,0.052-0.201,0.1-0.3,0.155c-0.303,0.168-0.602,0.347-0.895,0.542l-7.3,4.767C219.549,21.948,179.304,0,133.304,0v0.255
	c-44,0.117-81.08,31.575-81.08,70.231c0,0.381,0.112,0.755,0.14,1.128c-0.028,0.374-0.015,0.748-0.015,1.128
	c0,14.231,4.693,27.686,13.176,37.883c9.15,11,21.623,17.058,35.101,17.058c0.049,0,0.102-0.007,0.151-0.007
	c0.049,0,0.099,0.007,0.148,0.007c21.686,0,38.673-14.047,38.673-31.979c0-8.284-6.715-15-14.999-15
	c-8.029,0-14.585,6.309-14.981,14.24c-0.869,0.912-3.87,2.738-8.69,2.738c-0.049,0-0.096,0.007-0.145,0.007
	c-0.049,0-0.096-0.007-0.145-0.007c-10.061,0-18.246-11.188-18.246-24.94c0-0.381-0.029-0.755-0.057-1.128
	c0.028-0.374,0.057-0.748,0.057-1.128c0-22.187,23.101-40.236,51.496-40.236c0.833,0,1.644-0.085,2.44-0.216
	c33.982,0.829,64.166,17.326,83.585,42.525L201.08,85.144l-67.969,45.422h0h0h0l-46.486,66.62c-0.949-0.126-1.961-0.205-3.054-0.205
	c-10.037,0-21.039,5.901-32.701,17.562C26.048,239.365,25.26,288.25,25.238,290.32c-0.021,2.015,0.771,3.904,2.194,5.329
	c1.407,1.409,3.316,2.101,5.306,2.101c0.023,0,0.047,0,0.07,0c1.907,0,43.515-0.565,69.487-20h31.591
	c76.438,0,138.625-62.299,138.625-138.875C272.512,118.948,268.314,99.992,260.757,82.845z M135.166,153.834l33.534,33.533
	l-45.138,30.016L104.278,198.1L135.166,153.834z M133.887,247.75h-8.87c1.744-5.78,1.456-10.377,0.58-13.707l66.663-44.329
	l47.678-74.387c1.68,7.586,2.574,15.464,2.574,23.548C242.512,198.909,193.783,247.75,133.887,247.75z"
                  />
                </svg>
                <input
                  type="Range"
                  className="Range"
                  min="5"
                  max="15"
                  onChange={handleRangeIncreaments}
                  value={range}
                />
              </div>
              <div className="SettingsContainer">
                <span
                  style={{
                    background: bgcolor,
                    width: "25px",
                    height: "25px",
                    display: "block",
                    borderRadius: "10px",
                  }}
                ></span>
                <input
                  type="color"
                  className="ColorPicker"
                  onChange={changeBgColor}
                  value={bgcolor}
                />
              </div>
            </div>
          </div>
          <button className="funcButton" id="Calculate" onClick={sendData}>
            {t("calculate")}
          </button>
        </div>
        <div className="Container">
          <input type="text" className="Resultbox" value={textValue} />
        </div>
          <canvas
            ref={canvasref}
            id="canvas"
            className="absloute top-0 left-0 width-full h-full"
            onMouseDown={startDrawing}
            onMouseOut={stopDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onTouchMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
          />
        </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Background {
    width: 100vw;
    height: 100vh;

    background-color: black;
  }

  .Container {
    display: flex;
    flex-direction: row;
    margin: 0;
    width: 100vw;
  }

  .funcButton {
    width: 35vw;
    max-width: 100%;
    height: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
    padding: 15px;
    font-size: 40px;
    transition: ease 0.3s;

    background-color: #252525;
    color: white;
  }

  .SettingsContainer {
    display: flex;
    margin-bottom: 7px;
  }

  .funcButton:hover {
    background-color: black;
    color: white;
  }

  .Range{
    width: "100px",
    marginTop: "5px",
    marginLeft: "10px",
  }

  .settings {
    display: flex;
    width: 35vw;
    max-width: 100%;
    height: 100px;

    justify-content: center;
    background-color: #171717;
  }

  .colorContainer {
    display: flex;
    flex-direction: column;
    margin-left: 4px;
    justify-content: center;
  }

  .ColorPicker {
    width: 40px;
    height: 20px;
    margin-left: 10px;
    border-radius: 3px;
  }

  .Resultbox {
    width: 100vw;
    max-width: 100%;
    padding: 10px;
    margin: 0;

    border: none;
    background-color: #272727;
    font-size: 16px;
    text-align: center;
    overflow: scroll;
    color: white;
  }

  @media (max-width: 768px) {
    .Background {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .funcButton{
      font-size:20px;
    }
    
    .SettingsContainer{
      width:100px;
    }

    .Range{
      width:60px;
    }
    

    .Resultbox {
      width: 100%;
    }
  }
`;

export default mathNotes;
