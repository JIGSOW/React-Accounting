import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BackGround,
  Card,
  InputField,
  Button,
  SearchField,
  TopBar,
  ToolTip,
} from "../../Tools/Components";
import { refreshAccessToken } from "../../Tools/authService";
import {
  debounce,
  getInventories,
  searchBy_only_Supplies,
  search_inventory,
} from "../../Tools/BackendServices";
import Drawer from "../../Tools/Drawer";
import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Tools/TableComponent";
import { useTranslation } from "react-i18next";

const Inventory = () => {
  const { t } = useTranslation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [inventories, setInventories] = useState([
    {
      supply: "",
      initial_countity: "",
      final_countity: "",
      initial_fund: "",
      final_fund: "",
      sales_countity: "",
      sales_value:"",
      purchase_value:"",
      purchase_countity: "",
      debt_countity: "",
      unpaid_customers: "",
      discrepancy: "",
      dispatched_supply: "",
      dispatched_value: "",
      profits: "",
      start_date: "",
      end_date: "",
      inventory_date: "",
      notes: "",
    },
  ]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [supply, setSupply] = useState("");
  const [suppliesData, setSuppliesData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inventoryAdded, setInventoryAdded] = useState("");
  const [searchInventory, setSearchInventory] = useState("");
  const [showTable, setShowTable] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user_data"));

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const backToMain = () => {
    navigate("/main");
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

  const handleShow = (inventory) => {
    setSelectedInventory(inventory);
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
    setSupply(query);
    debouncedFetchSupplies(query);
    if (query == "" || query == null) {
      setSuppliesData([]);
    }
  };

  const handleSuppliesSelect = (supply) => {
    setSupply(supply);
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

  const searchFetchInventory = async (query = "") => {
    search_inventory(userData, query, setInventories);
  };

  const debouncedFetchInventory = useCallback(
    debounce(searchFetchInventory, 300),
    []
  );

  const handleInventorySearch = (event) => {
    const query = event.target.value;
    setSearchInventory(query);
    debouncedFetchInventory(query);
    if (query === "" || query === null) {
      setdispatchData([]);
    }
  };

  const fetchInventories = () => {
    getInventories(userData, setInventories);
  };

  const clearBtn = () => {
    fetchInventories();
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const send_data = async (event) => {
    event.preventDefault();

    // Refresh the access token
    const newAccessToken = await refreshAccessToken();

    await axios
      .post(
        `${import.meta.env.VITE_API_URL}/${
          userData.user_name
        }/generate-inventory/`,
        {
          user: userData.user_name,
          supply: supply,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setInventoryAdded(`${supply} Inventory Generated Successfully`);
        fetchInventories();
        location.reload();
      })
      .catch((error) => {
        alert("An Error Happend Please Wait and Try Again");
      });
  };

  const deleteInventory = async (inventoryID) => {
    const newAccessToken = await refreshAccessToken();
    await axios
      .delete(
        `${import.meta.env.VITE_API_URL}/${
          userData.user_name
        }/delete-inventory/`,
        {
          data: { id: inventoryID },
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        fetchInventories();
        location.reload();
      })
      .catch((error) => {
        alert("An Error Happened. Please Wait and Try Again.");
      });
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar
          drawerButton_Onclick={toggleDrawer(true)}
          backButton_Onclick={backToMain}
          Text={t("inventory")}
        />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

        <Card className="ItemsContainer">
          <div className="Firstrow">
            <div className="supplyField">
              <InputField
                placeholder={t("supply")}
                type="text"
                value={supply}
                onChange={handleSearchSupplies}
                onKeyDown={handleSuppliesKeyDown}
              />
              {supply && (
                <>
                  {suppliesData.length > 0 && supply && (
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
            <div className="DateField">
              <label className="labels">{t("startDate")}</label>
              <InputField
                placeholder="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                className="input-field"
              />
              <label className="labels">{t("endDate")}</label>
              <InputField
                placeholder="End Date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                className="input-field"
              />
            </div>
          </div>

          <div className="Fourthrow">
            {inventoryAdded && (
              <p style={{ color: "white" }}>{inventoryAdded}</p>
            )}
          </div>

          <div className="Fourthrow">
            <Button className="Generate Inventory" onClick={send_data}>
              {t("generate")}
            </Button>
            <ToolTip text={t("inventory_warn")} />
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
              value={searchInventory}
              onChange={handleInventorySearch}
              onClick={clearBtn}
            />
            <Table className="Table">
              <TableHeader className="TableHeader">
                <TableRow className="Tablehead">
                  <TableHead>{t("inventory")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="Tablebody">
                {inventories.map((inventory) => (
                  <TableRow key={inventory.id}>
                    <TableCell className="Name">
                      {inventory.supply} - {inventory.start_date} {"-->>"}{" "}
                      {inventory.end_date}
                    </TableCell>
                    <TableCell className="ButtonsCell">
                      <Button
                        className="TableButton"
                        onClick={() => handleShow(inventory)}
                      >
                        {t("show")}
                      </Button>
                      <Button
                        className="TableButton"
                        onClick={() => deleteInventory(inventory.id)}
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

        {selectedInventory && (
          <div className="SubScreen">
            <Button
              className="SubScreenBtn"
              onClick={() => setSelectedInventory(null)}
            >
              {t("close")}
            </Button>
            <div className="TableContainer">
              <Table className="Table">
                <TableHeader className="TableHeader">
                  <TableRow className="Tablehead">
                    <TableHead>{t("supply")}</TableHead>
                    <TableHead>{t("initialCountity")}</TableHead>
                    <TableHead>{t("finalCountity")}</TableHead>
                    <TableHead>{t("initialFund")}</TableHead>
                    <TableHead>{t("finalFund")}</TableHead>
                    <TableHead>{t("salesCountity")}</TableHead>
                    <TableHead>{t("sells_value")}</TableHead>
                    <TableHead>{t("purchaseCountity")}</TableHead>
                    <TableHead>{t("purchase_value")}</TableHead>
                    <TableHead>{t("debtCountity")}</TableHead>
                    <TableHead>{t("unPaidCustomers")}</TableHead>
                    <TableHead>{t("discrepancy")}</TableHead>
                    <TableHead>{t("dispatchedSupply")}</TableHead>
                    <TableHead>{t("dispatchedValue")}</TableHead>
                    <TableHead>{t("profits")}</TableHead>
                    <TableHead>{t("startDate")}</TableHead>
                    <TableHead>{t("endDate")}</TableHead>
                    <TableHead>{t("inventoryDate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="Tablebody">
                  <TableCell>{selectedInventory.supply}</TableCell>
                  <TableCell>{selectedInventory.initial_countity}</TableCell>
                  <TableCell>{selectedInventory.final_countity}</TableCell>
                  <TableCell>{selectedInventory.initial_fund}</TableCell>
                  <TableCell>{selectedInventory.final_fund}</TableCell>
                  <TableCell>{selectedInventory.sales_countity}</TableCell>
                  <TableCell>{selectedInventory.sales_value}</TableCell>
                  <TableCell>{selectedInventory.purchase_countity}</TableCell>
                  <TableCell>{selectedInventory.purchase_value}</TableCell>
                  <TableCell>{selectedInventory.debt_countity}</TableCell>
                  <TableCell>{selectedInventory.unpaid_customers}</TableCell>
                  <TableCell>{selectedInventory.discrepancy}</TableCell>
                  <TableCell>{selectedInventory.dispatched_supply}</TableCell>
                  <TableCell>{selectedInventory.dispatched_value}</TableCell>
                  <TableCell>{selectedInventory.profits}</TableCell>
                  <TableCell>{selectedInventory.start_date}</TableCell>
                  <TableCell>{selectedInventory.end_date}</TableCell>
                  <TableCell>{selectedInventory.inventory_date}</TableCell>
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </BackGround>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100vh;
  }

  .ItemsContainer {
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0.4em;

    margin-top: 5em;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 5em;

    background-color: hsla(0, 0%, 9%, 0.788);
    backdrop-filter: blur(5px);
    opacity: 1;
    border-radius: 25px;

    width: 35vw;
    height: 35vh;

    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
  }

  .SubScreen {
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-x: auto;

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: hsla(0, 0%, 9%, 0.788);
    padding: 2em;
    border: 1px solid #ccc;
    border-radius: 20px;
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

  .TableContainer {
    width: 100vw;
    height: auto;

    overflow-y: auto;
    overflow-x: auto;
  }

  .SubScreenBtn {
    margin-bottom: 20px;
  }

  .Firstrow {
    display: flex;
    felx-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: 1em;

    padding: 1em;
    height: 6em;

    .supplyField {
      position: relative;
    }
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
    felx-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: -3em;

    padding: 3em;
    height: 6em;
  }

  .DateField {
    display: flex;

    margin-left: 20px;
    margin-right: 20px;
  }

  .input-field {
    margin-left: -1em;
    margin-right: -1em;

    margin: 1em;
  }

  .labels {
    color: white;
    align-self: center;
    justify-self: center;
  }

  .Thirdrow {
    display: flex;
    felx-direction: row;
    align-items: center;
    justify-content: center;

    margin-top: -3em;

    padding: 1em;
    height: 6em;
  }

  .Fourthrow {
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
    padding-bottom: 18px;
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

  .Name {
    font-size: 16px;
    font-weight: 600;
  }

  .TableHeader {
    background: #171717;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    font-weight: 600;
    font-size: 17px;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .ItemsContainer {
      margin-top: 5em;
      margin-left: 0.5em;
      margin-right: 0.5em;
      margin-bottom: 1.5em;

      padding: 0.5em;

      width: 60vw;
      height: 40vh;
    }

    .SubScreen {
      overflow-x: auto;

      border: 1px solid #ccc;
    }

    .Firstrow {
      margin-top: 1em;
      padding: 0.2em;
      height: 6em;
    }

    .Secondrow {
      margin-top: -1em;
    }
  }

  @media (max-width: 768px) {
    .ItemsContainer {
      margin-top: 5em;
      margin-left: 0.5em;
      margin-right: 0.5em;
      margin-bottom: 1.5em;

      padding: 0.5em;

      overflow-y: auto;
      width: 97vw;
      height: 45vh;
    }

    .Firstrow {
      margin-top: 1em;
      padding: 0.2em;
      height: 6em;
    }

    .Secondrow {
      margin-top: -4em;
      height: auto;
    }

    .DateField {
      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;
      text-align: center;

      margin-bottom: 1em;
    }

    .TopBarText {
      margin-left: 10px;
      font-size: 15px;
    }

    .dataScreen {
      height: 300px;
    }

    .labels {
      margin-right: 1.5em;
      margin-bottom: 0.5em;
    }

    .input-field {
      margin-left: 1.5em;
    }
  }
`;

export default Inventory;
