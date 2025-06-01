import styled from "styled-components";
import axios from "axios";
import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken, logout } from "../../Tools/authService";
import {
  debounce,
  searchBy_only_Supplies,
  getSell,
  search_sell,
} from "../../Tools/BackendServices";
import Drawer from "../../Tools/Drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Tools/TableComponent";
import {
  BackGround,
  Card,
  InputField,
  Button,
  SearchField,
  TopBar,
  ToolTip
} from "../../Tools/Components";
import { useTranslation } from "react-i18next";

function MainSellScreen() {
  const { t } = useTranslation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchSupplies, setSearchSupplies] = useState("");
  const [suppliesData, setSuppliesData] = useState([]);
  const [editsuppliesData, seteditSuppliesData] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [countity, setCountity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sellAdded, setsellAdded] = useState("");
  const [sellData, setSellData] = useState([
    {
      supply: "",
      countity: "",
      price: "",
      date: "",
      notes: "",
    },
  ]);
  const [editSellID, setEditSellID] = useState(null);
  const [searchEditSupplies, setSearchEditSupplies] = useState("");
  const [editsellData, setEditsellData] = useState({
    id: "",
    countity: "",
    price: "",
    date: "",
    notes: "",
  });
  const [searchSells, setSearchSells] = useState("");
  const [showTable, setShowTable] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user_data"));

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  const logoutNav = () => {
    navigate("/");
  };

  const logoutBtn = async (event) => {
    event.preventDefault();
    const logoutConfirm = window.confirm("Do You Really Want To Logout?");
    if (logoutConfirm) {
      await logout();
      logoutNav();
    }
  };

  const navigatetoSupplies = () => {
    navigate("/main/supplies");
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const searchForSupplies = async (query = "") => {
    searchBy_only_Supplies(userData, query, setSuppliesData);
  };

  const debouncedFetchSupplies = useCallback(
    debounce(searchForSupplies, 300),
    []
  );

  const handleSearchSupplies = (event) => {
    const query = event.target.value;
    setSearchSupplies(query);
    debouncedFetchSupplies(query);
    if (query == "" || query == null) {
      setSuppliesData([]);
    }
  };

  const handleSuppliesSelect = (supply) => {
    setSearchSupplies(supply);
    setSuppliesData([]);
  };

  const handleSuppliesKeyDown = (event) => {
    if (suppliesData.length > 0) {
      if (event.key === "ArrowDown") {
        setFocusedIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % suppliesData.length;
          scrollToItem(nextIndex);
          return nextIndex;
        });
      } else if (event.key === "ArrowUp") {
        setFocusedIndex((prevIndex) => {
          const nextIndex =
            (prevIndex - 1 + suppliesData.length) % suppliesData.length;
          scrollToItem(nextIndex);
          return nextIndex;
        });
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        handleSuppliesSelect(suppliesData[focusedIndex].supply_name);
        setCountity(1);
        setPrice(suppliesData[focusedIndex].sell_price);
      }
    }
  };

  const scrollToItem = (index) => {
    const dropdown = dropdownRef.current;
    const item = dropdown?.children[index];
    if (item) {
      const itemHeight = item.offsetHeight;
      const visibleStart = dropdown.scrollTop;
      const visibleEnd = visibleStart + dropdown.clientHeight;

      const itemStart = item.offsetTop;
      const itemEnd = itemStart + itemHeight;

      if (itemStart < visibleStart) {
        dropdown.scrollTop = itemStart;
      } else if (itemEnd > visibleEnd) {
        dropdown.scrollTop = itemEnd - dropdown.clientHeight;
      }
    }
  };

  const searchForEditSupplies = async (query = "") => {
    searchBy_only_Supplies(userData, query, seteditSuppliesData);
  };

  const debouncedFetchEditSupplies = useCallback(
    debounce(searchForEditSupplies, 300),
    []
  );

  const handleSearchEditSupplies = (event) => {
    const query = event.target.value;
    setSearchEditSupplies(query);
    debouncedFetchEditSupplies(query);
    if (query == "" || query == null) {
      seteditSuppliesData([]);
    }
  };

  const handleEditSuppliesSelect = (supply) => {
    setSearchEditSupplies(supply);
    seteditSuppliesData([]);
  };

  const handleEditSuppliesKeyDown = (event) => {
    if (editsuppliesData.length > 0) {
      if (event.key === "ArrowDown") {
        setFocusedIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % editsuppliesData.length;
          scrollToItem(nextIndex);
          return nextIndex;
        });
      } else if (event.key === "ArrowUp") {
        setFocusedIndex((prevIndex) => {
          const nextIndex =
            (prevIndex - 1 + editsuppliesData.length) % editsuppliesData.length;
          scrollToItem(nextIndex);
          return nextIndex;
        });
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        handleEditSuppliesSelect(editsuppliesData[focusedIndex].supply_name);
      }
    }
  };

  const searchFetchSells = async (query = "") => {
    search_sell(userData, query, setSellData);
  };

  const debouncedFetchSells = useCallback(debounce(searchFetchSells, 300), []);

  const handleSellsSearch = (event) => {
    const query = event.target.value;
    setSearchSells(query);
    debouncedFetchSells(query);
    if (query === "" || query === null) {
      setSellData([]);
    }
  };

  const send_data = async (event) => {
    event.preventDefault();

    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios
      .post(
        `${import.meta.env.VITE_API_URL}/${userData.user_name}/sell-supplies/`,
        {
          user: userData.user_name,
          supplies: searchSupplies,
          countity: countity,
          price: price,
          date: date,
          notes: notes,
        },
        {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setsellAdded(`${searchSupplies} ${t("addedSuccessfully")}`);
        setSellData([
          ...sellData,
          {
            supply: searchSupplies,
            countity: countity,
            price: price,
            date: date,
            notes: notes,
          },
        ]);
        setSearchSupplies("");
        setCountity("");
        setPrice("");
        setDate("");
        setNotes("");
        location.reload();
      })
      .catch((error) => {
        alert("An Error Happend Please Wait and Try Again", error);
      });
  };

  const fetchSells = () => {
    getSell(userData, setSellData);
  };

  useEffect(() => {
    fetchSells();
  }, []);

  const clearButton = () => {
    fetchSells();
  };

  const editSell = async (sellID) => {
    try {
      const newAccessToken = await refreshAccessToken();

      console.log(editsellData);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-sell/`,
        {
          ...editsellData,
          supply: searchEditSupplies,
        },
        {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSellData(
        sellData.map((sell) =>
          sell.id === sellID ? { ...sell, ...editsellData } : sell
        )
      );
      setEditSellID(null);
      setEditsellData({
        supply: "",
        countity: "",
        price: "",
        date: "",
        total: "",
        notes: "",
      });
      fetchSells();
    } catch (error) {
      console.error("Error saving supply", error);
      alert("An error happened while saving the supply. Please try again.");
    }
  };

  const deleteSell = async (sellID) => {
    try {
      const newAccessToken = await refreshAccessToken();

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-sell/`,
        {
          data: { id: sellID },
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSellData(sellData.filter((sell) => sell.id !== sellID));
      fetchSells();
    } catch (error) {
      console.error("Error deleting supply", error);
      alert("An error happened while deleting the supply. Please try again.");
    }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar
          drawerButton_Onclick={toggleDrawer(true)}
          buttonText={t("logout")}
          backButton_Onclick={logoutBtn}
          Text={t("sellSupplies")}
        />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

        <Card className="ItemsContainer">
          <div className="Firstrow">
            <div className="supplyField">
              <InputField
                className="FirstrowField"
                placeholder={t("supply")}
                type="text"
                value={searchSupplies}
                onChange={handleSearchSupplies}
                onKeyDown={handleSuppliesKeyDown}
              />
              {searchSupplies && (
                <>
                  {suppliesData.length > 0 && searchSupplies && (
                    <div className="dropdown" ref={dropdownRef}>
                      {suppliesData.map((supply, index) => (
                        <div
                          key={index}
                          className={`dropdown-item${
                            index === focusedIndex ? "-focused" : ""
                          }`}
                          onClick={() =>
                            handleSuppliesSelect(supply.supply_name)
                          }
                        >
                          {supply.supply_name}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="Secondrow">
            <InputField
              placeholder={t("countity")}
              type="number"
              className="SecondrowField"
              value={countity}
              onChange={(e) => setCountity(e.target.value)}
            />

            <InputField
              placeholder={t("price")}
              type="number"
              className="SecondrowField"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <InputField
              placeholder={t("date")}
              type="date"
              className="SecondrowField"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="Thirdrow">
            <InputField
              placeholder={t("notes")}
              type="Text"
              className="ThirdrowField"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="ForthRow">
            <p style={{ color: "white" }}>{sellAdded}</p>
          </div>

          <div className="FifthRow">
            <Button onClick={send_data}>{t("sell")}</Button>
            <ToolTip text={t("main_warn")}/>
          </div>
        </Card>
        <footer>
          <div className="FooterCard">
            <Button
              className="showDatabtn"
              onClick={() => setShowTable(!showTable)}
            >
              {t("showdata")}
            </Button>
          </div>
        </footer>

        {showTable && (
          <div className="dataScreen">
            <Button
              className="dataScreenbtn"
              onClick={() => setShowTable(!showTable)}
            >
              {t("close")}
            </Button>
            <SearchField
              onClick={clearButton}
              value={searchSells}
              onChange={handleSellsSearch}
            ></SearchField>

            <Table className="Table">
              <TableHeader className="TableHeader">
                <TableRow className="Tablehead">
                  <TableHead
                    onClick={navigatetoSupplies}
                    style={{ cursor: "pointer" }}
                  >
                    {t("supply")}
                  </TableHead>
                  <TableHead>{t("countity")}</TableHead>
                  <TableHead>{t("price")}</TableHead>
                  <TableHead>{t("total")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("notes")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="Tablebody">
                {sellData.map((sell, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="TableCells"
                      style={{ fontSize: "20px", padding: "10px" }}
                    >
                      {editSellID === sell.id ? (
                        <div className="editSupplyContainer">
                          <InputField
                            className="Table-Input-Field"
                            type="text"
                            value={searchEditSupplies}
                            onChange={handleSearchEditSupplies}
                            onKeyDown={handleEditSuppliesKeyDown}
                          />
                          {searchEditSupplies && (
                            <>
                              {editsuppliesData.length > 0 &&
                                searchEditSupplies && (
                                  <div className="dropdown" ref={dropdownRef}>
                                    {editsuppliesData.map((supply, index) => (
                                      <div
                                        key={index}
                                        className={`dropdown-item${
                                          index === focusedIndex
                                            ? "-focused"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          handleEditSuppliesSelect(
                                            supply.supply_name
                                          )
                                        }
                                      >
                                        {supply.supply_name}
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </>
                          )}
                        </div>
                      ) : (
                        sell.supply
                      )}
                    </TableCell>
                    <TableCell
                      className="TableCells"
                      style={{ fontSize: "20px", padding: "10px" }}
                    >
                      {editSellID === sell.id ? (
                        <InputField
                          className="Table-Input-Field"
                          type="number"
                          value={editsellData.countity}
                          onChange={(e) =>
                            setEditsellData({
                              ...editsellData,
                              countity: e.target.value,
                            })
                          }
                        />
                      ) : (
                        sell.countity
                      )}
                    </TableCell>
                    <TableCell
                      className="TableCells"
                      style={{ fontSize: "20px", padding: "10px" }}
                    >
                      {editSellID === sell.id ? (
                        <InputField
                          className="Table-Input-Field"
                          type="number"
                          value={editsellData.price}
                          onChange={(e) =>
                            setEditsellData({
                              ...editsellData,
                              price: e.target.value,
                            })
                          }
                        />
                      ) : (
                        sell.price
                      )}
                    </TableCell>
                    <TableCell
                      className="TableCells"
                      style={{ fontSize: "20px", padding: "10px" }}
                    >
                      {sell.total}
                    </TableCell>
                    <TableCell
                      className="TableCells"
                      style={{ fontSize: "20px", padding: "10px" }}
                    >
                      {editSellID === sell.id ? (
                        <InputField
                          className="Table-Input-Field"
                          type="date"
                          value={editsellData.date}
                          onChange={(e) =>
                            setEditsellData({
                              ...editsellData,
                              date: e.target.value,
                            })
                          }
                        />
                      ) : (
                        sell.date
                      )}
                    </TableCell>
                    <TableCell
                      className="TableCells"
                      style={{ fontSize: "20px", padding: "10px" }}
                    >
                      {editSellID === sell.id ? (
                        <InputField
                          className="Table-Input-Field"
                          type="text"
                          value={editsellData.notes}
                          onChange={(e) =>
                            setEditsellData({
                              ...editsellData,
                              notes: e.target.value,
                            })
                          }
                        />
                      ) : (
                        sell.notes
                      )}
                    </TableCell>
                    <TableCell className="ButtonsCell">
                      {editSellID === sell.id ? (
                        <Button
                          className="TableButton"
                          onClick={() => editSell(sell.id)}
                        >
                          {t("save")}
                        </Button>
                      ) : (
                        <Button
                          className="TableButton"
                          onClick={() => {
                            setEditSellID(sell.id);
                            setSearchEditSupplies(sell.supply);
                            setEditsellData({
                              id: sell.id,
                              countity: sell.countity,
                              price: sell.price,
                              date: sell.date,
                              notes: sell.notes,
                            });
                          }}
                        >
                          {t("edit")}
                        </Button>
                      )}
                      <Button
                        className="TableButton"
                        onClick={() => deleteSell(sell.id)}
                      >
                        {t("delete")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  header {
    margin-bottom: 3.7em;
  }

  .Container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100vh;
  }

  .ItemsContainer {
    margin-top: 1em;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 2em;

    padding: 0.5em;

    width: 43vw;
    height: 55vh;
  }

  .FooterCard {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 5em;
    width: 12em;

    background: hsl(0, 0%, 9%);
    border-radius: 30px;
    .showDatabtn {
      height: 3em;
    }
  }

  .dataScreen {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 90vw;
    height: 450px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: hsla(0, 0%, 9%, 0.788);
    padding: 2em;
    border: 1px solid #ccc;

    border-radius: 20px;
    .dataScreenbtn {
      margin-bottom: 1em;
    }
  }

  .Firstrow {
    display: flex;
    felx-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: 1em;
    padding: 1em;

    height: 6em;

    .FirstrowField {
      margin-left: 0.5em;
      margin-right: 0.5em;
      width: 16em;
    }

    .typeField {
      position: relative;
    }

    .supplyField {
      position: relative;
    }
  }

  .editSupplyContainer {
    position: relative;
  }

  .TopBarText{
    font-size:17px;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #252525;
    color: white;
    border: 1px solid #171717;
    border-radius: 15px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 1000;
  }

  .dropdown-item {
    padding: 6px;
    cursor: pointer;
  }

  dropdown-item-focused {
    background: #444;
  }

  .dropdown-item:hover {
    background: #444;
  }

  .Secondrow {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-top: -2em;

    .CountityField {
      display: flex;
      flex-direction: row;

      align-items: center;
      justify-content: center;

      padding-right: -1em;
      padding-left: 1em;

      margin-left: 0.5em;

      .Countity {
        width: 8em;

        padding-top: 0.7em;

        margin-top: 0.7em;
        margin-right: 1em;
        margin-left: 0.3em;
      }

      .UnitDropDown {
        position: relative;
      }
    }

    .SecondrowField {
      padding-top: 0.7em;

      margin-top: 0.5em;
      margin-left: 0.2em;
      margin-right: 1.5em;
    }
  }

  .ForthRow {
    display: flex;
    felx-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: -3em;

    padding: 1em;
    height: 6em;
  }

  .FifthRow {
    display: flex;
    felx-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: -3em;

    padding: 1em;
    height: 6em;
  }

  .TypesCell {
    width: 50%;
  }

  .ButtonsCell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 15px;
  }

  .TableButton {
    padding: 0.5em;
    padding-left: 2.1em;
    padding-right: 2.1em;
    border-radius: 5px;

    margin-right: 0.5em;
    border: none;

    outline: none;

    transition: 0.4s ease-in-out;

    background-color: #171717;
    color: white;

    &.TableButton:hover {
      background-color: red;
    }
  }

  .backbtn {
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
    border-radius: 5px;

    margin-right: 2em;
    border: none;

    outline: none;

    transition: 0.4s ease-in-out;

    background-color: #252525;
    color: white;

    &.backbtn:hover {
      background-color: red;
    }
  }

  .Table {
    width: 100vw;
    height: auto;
    background: #252525;
    color: white;
    border-collapse: separate;
    border-spacing: 5px;
  }

  .TableHeader {
    background: #171717;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    font-weight: 600;
    font-size: 17px;
  }

  .Table-Input-Field {
    font-size: 16px;
    width: 150px;
    height: 30px;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .TopBarText {
      margin-left: 1.2em;
      margin-right: 1.2em;
    }

    .ItemsContainer {
      margin-top: 3em;
      margin-left: 0.5em;
      margin-right: 0.5em;
      margin-bottom: 2em;

      padding: 0.5em;

      width: 75vw;
      height: 50vh;
    }

    .Firstrow {
      margin-top: 1em;
      padding: 0.5em;
      height: 6em;

      .FirstrowField {
        margin-left: 0.5em;
        margin-right: 0.5em;
        width: 15em;
      }
    }

    .Secondrow {
      margin-top: -1em;
    }
  }

  @media (max-width: 768px) {
    .TopBarText {
      margin-left: 1.5em;
      margin-right: 1.5em;
    }

    .Container {
      overflow: hidden;
    }

    .ItemsContainer {
      margin-top: 2em;
      margin-left: 0.5em;
      margin-right: 0.5em;
      margin-bottom: 1em;

      padding: 0.5em;

      width: 300px;
      height: 300px;
    }

    .Firstrow {
      display: inline-block;
      margin-top: 1.2em;
      padding: 0.5em;
      height: 6em;

      .FirstrowField {
        width: 250px;
      }
    }

    .Secondrow {
      display: block;

      margin-top: -2em;

      .CountityField {
        display: flex;
        flex-direction: row;

        align-items: center;
        justify-content: center;

        padding-right: -1em;
        padding-left: 1em;

        margin-left: 0.5em;
        width: 300px;
        .Countity {
          width: 8em;

          padding-top: 0.7em;

          margin-top: 0.7em;
          margin-right: 1em;
          margin-left: 0.1em;
        }
      }

      .SecondrowField {
        align-self: center;
        padding-top: 0.7em;
        margin: 1em;
      }
    }

    .dataScreen{
      height:300px;
    }

    .ForthRow {
      margin-top: 1.5em;

      padding: 1em;
      height: 6em;
    }

    .FifthRow {
      margin-top: -5em;

      padding: 1em;
      height: 6em;
    }
  }
`;

export default MainSellScreen;
