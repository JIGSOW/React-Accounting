/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "./authService";
import axios from "axios";
import { useTranslation } from "react-i18next";

function CustomDrawer({ isOpen, toggleDrawer }) {
  const { t, i18n } = useTranslation();

  const [sellsFund, setSellsFund] = useState("");
  const [permanatFund, setPermanatFund] = useState("");
  const [drawerSide, setDrawerSide] = useState(
    i18n.dir() === "rtl" ? "right" : "left"
  );

  

  const userData = JSON.parse(localStorage.getItem("user_data"));

  const fetchFunds = async () => {
    const newAccessToken = await refreshAccessToken();

    await axios
      .get(
        `${import.meta.env.VITE_API_URL}/${userData.user_name}/money-funds/`,
        {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setSellsFund(response.data.sells_fund);
        setPermanatFund(response.data.permanant_fund);
      })
      .catch((error) => {
        alert("An error happened while fetching Funds. Please try again.");
      });
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const send_data = async (event) => {
    event.preventDefault();

    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    if (sellsFund != 0) {
      await axios
        .post(
          `${import.meta.env.VITE_API_URL}/${
            userData.user_name
          }/move-sells-funds/`,
          {
            user: userData.user_name,
            sellsFund: sellsFund,
          },
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          location.reload();
        })
        .catch((error) => {
          alert("An Error Happend Please Wait and Try Again");
        });
    }
  };

  const navigate = useNavigate();

  const goCustomers = () => {
    navigate("/main/customers");
  };

  const goSellCustomers = () => {
    navigate("/main/sell-customers");
  };

  const goMoneyIncome = () => {
    navigate("/main/money-income");
  };

  const goPayments = () => {
    navigate("/main/payments");
  };

  const goTypes = () => {
    navigate("/main/types");
  };

  const goSupplies = () => {
    navigate("/main/supplies");
  };

  const goDisptach = () => {
    navigate("/main/dispatch-supplies");
  };

  const goReciepts = () => {
    navigate("/main/reciepts");
  };

  const goEmployee = () => {
    navigate("/main/employees");
  };

  const goInventory = () => {
    navigate("/main/inventory");
  };

  const goOptions = () => {
    navigate("/main/options");
  };

  const shortcuts = {
    "alt+c": "/main/customers",
    "alt+x": "/main/sell-customers",
    "alt+m": "/main/money-income",
    "alt+p": "/main/payments",
    "alt+t": "/main/types",
    "alt+s": "/main/supplies",
    "alt+d": "/main/dispatch-supplies",
    "alt+a": "/main/reciepts",
    "alt+e": "/main/employees",
    "alt+i": "/main/inventory",
    "alt+b": "/main",
  };

  function getShortcutKey(event) {
    let modifier = "";
    if (event.ctrlKey) {
      modifier = "ctrl";
    } else if (event.altKey) {
      modifier = "alt";
    }
    if (modifier) {
      return `${modifier}+${event.key.toLowerCase()}`;
    }
    return null;
  }

  function handleKeyDown(event) {
    const shortcutKey = getShortcutKey(event);
    if (shortcutKey && shortcuts.hasOwnProperty(shortcutKey)) {
      event.preventDefault();
      event.stopPropagation();
      navigate(shortcuts[shortcutKey]);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const languages = [
    { code: "en", lang: "English" },
    { code: "ar", lang: "عربي" },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setDrawerSide(i18n.dir() === "rtl" ? "right" : "left");
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <DrawerWrapper>
      <Overlay isOpen={isOpen} onClick={toggleDrawer(false)} />
      <DrawerContent drawerSide={drawerSide} isOpen={isOpen}>
        <div
          className="Drawer"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className="BluredScreen">
            <div className="LanguageSelector">
              {languages.map((lng) => {
                return (
                  <button
                    className={lng.code === i18n.language ? "selected" : "btn"}
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                  >
                    {lng.lang}
                  </button>
                );
              })}
              <button onClick={goOptions} className="btn">
                {t("options")}
              </button>
            </div>
            <h2 className="FundValue">{t("sellsFund")}</h2>
            <p className="FundValueNumber">{sellsFund}</p>
            <button className="SellsFundBtn" onClick={send_data}>
              {t("moveToPerma")}
            </button>
            <h2 className="FundValue">{t("permaFund")}</h2>
            <p className="FundValueNumber">{permanatFund}</p>
            <div className="PagesContainer">
              <button onClick={goCustomers} className="btn">
                {t("customers")} <br />
                <span className="ShortCutTip">(alt + c)</span>
              </button>
              <button onClick={goSellCustomers} className="btn">
                {t("sellCustomer")} <br />
                <span className="ShortCutTip">(alt + x)</span>
              </button>
              <button onClick={goMoneyIncome} className="btn">
                {t("moneyIncome")} <br />
                <span className="ShortCutTip">(alt + m)</span>
              </button>
              <button onClick={goPayments} className="btn">
                {t("payment")} <br />
                <span className="ShortCutTip">(alt + p)</span>
              </button>
              <button onClick={goTypes} className="btn">
                {t("types")} <br />
                <span className="ShortCutTip">(alt + t)</span>
              </button>
              <button onClick={goSupplies} className="btn">
                {t("supplies")} <br />
                <span className="ShortCutTip">(alt + s)</span>
              </button>
              <button onClick={goDisptach} className="btn">
                {t("dispatchSupplies")} <br />
                <span className="ShortCutTip">(alt + d)</span>
              </button>
              <button onClick={goReciepts} className="btn">
                {t("buySupplies")} <br />
                <span className="ShortCutTip">(alt + a)</span>
              </button>
              <button onClick={goEmployee} className="btn">
                {t("employees")} <br />
                <span className="ShortCutTip">(alt + e)</span>
              </button>
              <button onClick={goInventory} className="btn">
                {t("inventory")} <br />
                <span className="ShortCutTip">(alt + i)</span>
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </DrawerWrapper>
  );
}

const DrawerWrapper = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};
  transition: opacity 0.3s ease-in-out;
  z-index: 999; /* Ensure it's above other content */
`;

const DrawerContent = styled.div`
  .Drawer {
    position: fixed;
    top: 0;
    ${(props) => (props.drawerSide === "left" ? "left: 0;" : "right: 0;")}

    height: 100%;
    width: 30vw;

    background-color: rgba(245, 245, 245, 0.9);
    backdrop-filter: blur(10px);

    color: white;

    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.3);

    transform: translateX(
      ${(props) =>
        props.isOpen ? "0" : props.drawerSide === "left" ? "-100%" : "100%"}
    );
    transition: transform 0.3s ease-in-out;

    z-index: 1000; /* Ensure it's above the overlay */

    --s: 37px; /* control the size */

    --c: #0000, #282828 0.5deg 119.5deg, #0000 120deg;
    --g1: conic-gradient(from 60deg at 56.25% calc(425% / 6), var(--c));
    --g2: conic-gradient(from 180deg at 43.75% calc(425% / 6), var(--c));
    --g3: conic-gradient(from -60deg at 50% calc(175% / 12), var(--c));
    background: var(--g1), var(--g1) var(--s) calc(1.73 * var(--s)), var(--g2),
      var(--g2) var(--s) calc(1.73 * var(--s)), var(--g3) var(--s) 0,
      var(--g3) 0 calc(1.73 * var(--s)) #1e1e1e;
    background-size: calc(2 * var(--s)) calc(3.46 * var(--s));
  }

  .BluredScreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    overflow-y: auto;

    padding: 20px;

    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(7px);

    opacity: 1.2;

    pointer-events: auto;

    transition: opacity 0.3s ease-in-out;
    z-index: 999; /* Ensure it's above other content */
  }

  .SellsFund {
    display: span;
  }

  .FundValue {
    font-size: 25px;
    margin-top: 10px;
  }

  .FundValueNumber {
    font-size: 25px;
    margin-top: 10px;

    color: dodgerblue;
  }

  .PagesContainer {
    display: flex;
    flex-direction: column;
    padding: 0.5;
    margin-top: 2em;
  }

  .btn {
    padding: 0.5em;

    text-align: center;
    border-radius: 5px 25px;

    margin-right: 0.5em;
    margin-top: 1em;
    border: none;

    outline: none;

    transition: 0.4s ease-in-out;

    background-color: #252525;
    color: white;

    &.btn:hover {
      background-color: black;
    }
  }

  .LanguageSelector {
    .selected {
      padding: 0.5em;
      padding-left: 1em;
      padding-right: 1em;
      border-radius: 5px 25px;

      margin-right: 0.5em;
      margin-top: 1em;
      border: none;

      outline: none;

      transition: 0.4s ease-in-out;

      background-color: gray;
      color: white;

      &.btn:hover {
        background-color: black;
      }
    }
  }

  .downloadDropDown {
    position: relative;
  }

  .SellsFundBtn {
    padding: 0.5em;
    padding-left: 1em;
    padding-right: 2em;
    border-radius: 5px 25px;

    margin-right: 0.5em;
    margin-top: 1em;
    margin-bottom: 1em;
    border: none;

    outline: none;

    transition: 0.4s ease-in-out;

    background-color: #252525;
    color: white;

    &.SellsFundBtn:hover {
      background-color: black;
    }
  }

  @media (min-width: 1024px) {
    .ShortCutTip {
      display: inline-block;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .Drawer {
      width: 40vw;
    }

    .btn {
      padding: 0.5em;
      padding-left: 1.2em;
      padding-right: 8em;

      margin-right: 0.5em;
    }
  }

  @media (max-width: 760px) {
    .Drawer {
      width: 65vw;
    }

    .btn {
      padding: 0.5em;
      padding-left: 1em;
      padding-right: 1em;

      margin-right: 0.5em;
    }

    .ShortCutTip {
      display: none;
    }
  }
`;

export default CustomDrawer;
