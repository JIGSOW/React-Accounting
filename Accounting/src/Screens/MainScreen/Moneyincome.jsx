import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import Loader from '../../Tools/Loader'
import { refreshAccessToken } from '../../Tools/authService'
import { getIncome, debounce, searchIncome, searchCustomer } from '../../Tools/BackendServices'
import Drawer from '../../Tools/Drawer'
import { BackGround, Card, InputField, Button, SearchField, TopBar, ToolTip } from '../../Tools/Components'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"
import { useTranslation } from 'react-i18next';

function MoneyIncome() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [moneyFrom, setmoneyFrom] = useState('');
    const [total, settotal] = useState('');
    const [incomeDate, setincomeDate] = useState('');
    const [notes, setnotes] = useState('');
    const [moneyIncomeData, setmoneyIncomeData] = useState([]);
    const [moenyIncomeAdded, setmoenyIncomeAdded] = useState('');
    const [editIncome, seteditIncome] = useState('');
    const [editIncomeID, seteditIncomeID] = useState(null);
    const [editDate, setEditDate] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [edittotal, setEdittotal] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [customerData, setcustomerData] = useState([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const navigate = useNavigate();
    const [showTable, setShowTable] = useState(false);

    const dropdownRef = useRef(null);

    const userData = JSON.parse(localStorage.getItem('user_data'));

    const backToMain = () => {
        navigate("/main");
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const fetchIncome = () => {
        getIncome(userData, setmoneyIncomeData);
    }

    useEffect(() => {
        fetchIncome();
    }, []);

    const searchFetchIncome = async (query = '') => {
        searchIncome(userData, query, setmoneyIncomeData);
    };

    const debouncedMoneyIcnome = useCallback(debounce(searchFetchIncome, 300), []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedMoneyIcnome(query);
    };


    const searchfetchCustomer = async (query = '') => {
        searchCustomer(userData, query, setcustomerData);
    };

    const debouncedFetchCustomer = useCallback(debounce(searchfetchCustomer, 300), []);

    const handleSearchCustomerChange = (event) => {
        const query = event.target.value;
        setmoneyFrom(query);
        debouncedFetchCustomer(query);
        if (query == "" || query == null) {
            setcustomerData([]);
        }
    };


    const searchfetchEditCustomer = async (query = '') => {
        searchCustomer(userData, query, setcustomerData);
    };

    const debouncedFetchEditCustomer = useCallback(debounce(searchfetchEditCustomer, 300), []);

    const handleSearchEditCustomerChange = (event) => {
        const query = event.target.value;
        seteditIncome(query);
        debouncedFetchEditCustomer(query);
        if (query == "" || query == null) {
            setcustomerData([]);
        }
    };

    const clear_btn = () => {
        fetchIncome();
    }

    const send_data = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/manage-income/`, {
            user: userData.user_name,
            money_from: moneyFrom,
            total: total,
            date: incomeDate,
            notes: notes,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setmoenyIncomeAdded(`${moneyFrom} ${t(addedSuccessfully)}`);
            setmoneyIncomeData([...moneyIncomeData, { money_from: moneyFrom, total: total, date: incomeDate, notes: notes }]);
            setLoading(false);
            location.reload();
        }).catch(error => {
            // alert("An Error Happend Please Wait and Try Again");
            setLoading(false);
        });
    };

    const editMoneyIncome = async (id) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-income/`, {
                id: id,
                money_from: editIncome,
                total: edittotal,
                date: editDate,
                notes: editNotes,
            }, {
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            seteditIncomeID(null);
            setmoneyIncomeData([]);
            fetchIncome();
        } catch (error) {
            console.error('Error saving supply', error);
            alert("An error happened while saving the Employee. Please try again.");
        }
    };

    const handleCustomerSelect = (customer) => {
        setmoneyFrom(customer);
        setcustomerData([]);
    };

    const handleKeyDown = (event) => {
        if (customerData.length > 0) {
            if (event.key === 'ArrowDown') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % customerData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'ArrowUp') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex - 1 + customerData.length) % customerData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                handleCustomerSelect(customerData[focusedIndex].customer_name);
            }
        }
    };

    const handleeditCustomerSelect = (customer) => {
        seteditIncome(customer);
        setcustomerData([]);
    };

    const handleeditcustomerKeyDown = (event) => {
        if (customerData.length > 0) {
            if (event.key === 'ArrowDown') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % customerData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'ArrowUp') {
                setFocusedIndex((prevIndex) => {
                    const nextIndex = (prevIndex - 1 + customerData.length) % customerData.length;
                    scrollToItem(nextIndex);
                    return nextIndex;
                });
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                handleeditCustomerSelect(customerData[focusedIndex].customer_name);
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

    const deleteIncome = async (id) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-income/`, {
                data: { id: id },
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setmoneyIncomeData(moneyIncomeData.filter(income => income.id !== editIncomeID));
            fetchIncome();
        } catch (error) {
            console.error('Error deleting supply', error);
            alert("An error happened while deleting the supply. Please try again.");
        }
    };



    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text={t("moneyIncome")} />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <div className="customerField">
                        <InputField placeholder={t("customer")}
                            type="text" value={moneyFrom}
                            onChange={handleSearchCustomerChange}
                            onKeyDown={handleKeyDown}
                            className="first-field" />
                        {customerData.length > 0 && (
                            moneyFrom && <div className="dropdown" ref={dropdownRef}>
                                {customerData.map((customer, index) => (
                                    <div key={index} className={`dropdown-item${index === focusedIndex ? '-focused' : ''}`} onClick={() => handleCustomerSelect(customer.customer_name)}>
                                        {customer.customer_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <InputField placeholder={t("total")} type="number" value={total} onChange={(e) => settotal(e.target.value)} className="first-field" />
                </div>
                <div className="Secondrow">
                    <InputField placeholder={t("date")} type="date" value={incomeDate} onChange={(e) => setincomeDate(e.target.value)} className="note-field" />
                    <InputField placeholder={t("notes")} type="text" value={notes} onChange={(e) => setnotes(e.target.value)} className="note-field" />
                </div>

                <div className="Thirdrow">
                    <p style={{ color: 'white' }}>{moenyIncomeAdded}</p>
                </div>

                <div className="Fourthrow">
                    <Button className="AddType" onClick={send_data}>{t("addIncome")}</Button>
                    <ToolTip text={t("moneyIncome_warn")}/>
                </div>

                <div style={{ alignSelf: 'center' }}>
                    {loading && <Loader width='3' height='20' animateHeight='36' />}
                </div>
            </Card>
            <footer>
                <div className="FooterCard">
                    <Button className="showDatabtn" onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button>
                </div>
            </footer>

            {showTable && <div className='dataScreen'>
                <Button className='dataScreenbtn' onClick={() => setShowTable(!showTable)}>{t("close")}</Button>
                <SearchField value={searchQuery} onChange={handleSearchChange} onClick={clear_btn} />
                <Table className='Table'>
                    <TableHeader className='TableHeader'>
                        <TableRow className="Tablehead">
                            <TableHead>{t("customer")}</TableHead>
                            <TableHead>{t("total")}</TableHead>
                            <TableHead>{t("date")}</TableHead>
                            <TableHead>{t("notes")}</TableHead>
                            <TableHead>{t("actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="Tablebody">
                        {moneyIncomeData.map((income, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editIncomeID === income.id ? (
                                        <div className="SearchCustomer">
                                            <InputField
                                                className="Table-Input-Field"
                                                type="text"
                                                value={editIncome}
                                                onChange={handleSearchEditCustomerChange}
                                                onKeyDown={handleeditcustomerKeyDown}
                                            />
                                            {customerData.length > 0 && (
                                                editIncome && <div className="dropdown" ref={dropdownRef}>
                                                    {customerData.map((customer, index) => (
                                                        <div key={index} className={`dropdown-item${index === focusedIndex ? '-focused' : ''}`} onClick={() => handleeditCustomerSelect(customer.customer_name)}>
                                                            {customer.customer_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        income.money_from
                                    )}
                                </TableCell>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editIncomeID === income.id ? (
                                        <InputField
                                            className="Table-Input-Field"
                                            type="text"
                                            value={edittotal}
                                            onChange={(e) => setEdittotal(e.target.value)}
                                        />
                                    ) : (
                                        income.total
                                    )}
                                </TableCell>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editIncomeID === income.id ? (
                                        <InputField
                                            className="Table-Input-Field"
                                            type="date"
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                        />
                                    ) : (
                                        income.date
                                    )}
                                </TableCell>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editIncomeID === income.id ? (
                                        <InputField
                                            className="Table-Input-Field"
                                            type="text"
                                            value={editNotes}
                                            onChange={(e) => setEditNotes(e.target.value)}
                                        />
                                    ) : (
                                        income.notes
                                    )}
                                </TableCell>
                                <TableCell className='ButtonsCell'>
                                    {editIncomeID === income.id ? (
                                        <Button className='TableButton' onClick={() => editMoneyIncome(income.id)}>{t("save")}</Button>
                                    ) : (
                                        <Button className='TableButton' onClick={() => {
                                            seteditIncomeID(income.id);
                                            seteditIncome(income.money_from);
                                            setEditDate(income.date);
                                            setEdittotal(income.total);
                                            setEditNotes(income.notes)
                                        }}>{t("edit")}</Button>
                                    )}
                                    <Button className='TableButton' onClick={() => deleteIncome(income.id)} >{t("delete")}</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>}
        </BackGround>
    </StyledWrapper>)
}

const StyledWrapper = styled.div`


.Container {
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;

  height:100vh;
}

.ItemsContainer{
    padding-left: 1em;
    padding-right: 1em;
    padding-bottom: 0.4em;

    margin-top: 5em;
    margin-left: 0.5em;
    margin-right: 0.5em;
    margin-bottom: 5em;

    background-color: hsla(0, 0%, 9%, 0.788);
    backdrop-filter: blur(5px);
    opacity:1;
    border-radius: 25px;

    width:35vw;
    height: 35vh;

     box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
}

.Firstrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:1em;
    margin-bottom:0.8em;

    padding:1em;
    height:6em;
   
    .first-field{
        margin:1em;
    }

    .customerField{
        position: relative;
    }
}

.FooterCard{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    height:5em;
    width:12em;

    background:hsl(0, 0.00%, 9.00%);
    border-radius:30px;
    .showDatabtn{
        height:3em;
    }
}

.dataScreen{
    display:flex;
    flex-direction:column;
    align-items:center;

    width:90vw;
    height:450px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color :hsla(0, 0%, 9%, 0.788);
    padding: 2em;
    border: 1px solid #ccc;
       
    border-radius:20px;
    
    .dataScreenbtn{
        margin-bottom:1em;
    }
}

.SearchCustomer{
    position:relative;
}

.note-field{
    width:10em;
    margin-left:1em;
    margin-right:1em;
    margin-top:2px;
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

.Secondrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:0.5em;
    height:6em;
}

.Thirdrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:1em;
    height:6em;
}

.Fourthrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-2em;

    padding:1em;
    height:6em;
}

.TypesCell{
    width:50%;
}

.ButtonsCell{
    display:flex;
    align-items:center;
    justify-content:center;
    padding-bottom:18px;
}

.TableButton{
    padding: 0.5em;
    padding-left: 2.1em;
    padding-right: 2.1em;
    border-radius: 5px;

    align-self:center;
    justify-self:center;

    margin-right: 0.5em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #171717;
    color: white;

    &.TableButton:hover{
        background-color:red;
    }
}

.backbtn{
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
    border-radius: 5px;

    margin-right: 2em;
    border: none;
    
    outline: none;
    
    transition: .4s ease-in-out;
    
    background-color: #252525;
    color: white;

    &.backbtn:hover{
        background-color:red;
    }
}

.Table{
    width:100vw;
    height:auto;
    background:#252525;
    color:white;
    border-collapse: separate;
    border-spacing: 5px;
}

.TableHeader{
    background:#171717;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
    font-weight:600;
    font-size:17px;
}

.Table-Input-Field{
    font-size:18px;
    width:250px;
    height:40px;
}

@media (min-width: 768px) and (max-width: 1024px){
    .TopBarText{
        margin-left:1em;
    }

    .ItemsContainer{
        margin-top: 5em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1.5em;

        padding:0.5em;

        width:60vw;
        height: 40vh;
    }

    .Firstrow{   
        margin-top:1em;
        padding:0.2em;
        height:6em;
    }
    
    .Secondrow{
        margin-top:-1em;
    }
}
  

@media (max-width: 768px) {
    .TopBarText{
        margin-left:18px;
        font-size:15px;
    }

    .ItemsContainer{
        margin-top: 5em;
        margin-left:20px;
        margin-right:20px;
        margin-bottom:1.5em;

        padding:0.5em;

        width:95vw;
        height: 250px;

        overflow:auto;
    }

    

    .Firstrow{
        margin-top:1em;
        width:100vw;
        height:6em;

        align-self:center;

        margin-left:30px;
        margin-right:30px;
    }
    
    .dataScreen{
        height:300px;
    }

    .Secondrow{
        align-self:center;
        width:80vw;
    }

    .first-field{
        margin:0.2em;
    }

    .note-field{
        width:40vw;
    }
}  
`;


export default MoneyIncome