import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import Loader from '../../Tools/Loader'
import { refreshAccessToken } from '../../Tools/authService'
import { getPayment, debounce, searchPayment } from '../../Tools/BackendServices'
import Drawer from '../../Tools/Drawer'
import { BackGround, Card, InputField, Button, SearchField, TopBar } from '../../Tools/Components'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../Tools/TableComponent"
import { useTranslation } from 'react-i18next';

function Payments() {
    const { t } = useTranslation();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [moneyFor, setmoneyFor] = useState('');
    const [total, settotal] = useState('');
    const [paymentDate, setpaymentDate] = useState('');
    const [notes, setnotes] = useState('');
    const [paymentData, setpaymentData] = useState([]);
    const [paymentAdded, setpaymentAdded] = useState('');
    const [editpayment, seteditpayment] = useState('');
    const [editpaymentID, seteditpaymentID] = useState(null);
    const [editDate, setEditDate] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [edittotal, setEdittotal] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showTable, setShowTable] = useState(false);
    const navigate = useNavigate();

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

    const fetchPayments = () => {
        getPayment(userData, setpaymentData);
    }

    useEffect(() => {
        fetchPayments();
    }, []);

    const searchfetchPayments = async (query = '') => {
        searchPayment(userData, query, setpaymentData);
    };

    const debouncedMoneyIcnome = useCallback(debounce(searchfetchPayments, 300), []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedMoneyIcnome(query);
    };

    const clear_btn = () => {
        fetchPayments();
    }

    const send_data = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Refresh the access token
        const newAccessToken = await refreshAccessToken();

        await axios.post(`${import.meta.env.VITE_API_URL}/${userData.user_name}/manage-payment/`, {
            user: userData.user_name,
            money_for: moneyFor,
            total: total,
            date: paymentDate,
            notes: notes,
        }, {
            headers: {
                'Authorization': `Bearer ${newAccessToken}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            setpaymentAdded(`${moneyFor} ${t("addedSuccessfully")}`);
            setpaymentData([...paymentData, { money_for: moneyFor, total: total, date: paymentDate, notes: notes }]);
            setLoading(false);
            location.reload();
        }).catch(error => {
            alert("An Error Happend Please Wait and Try Again");
            setLoading(false);
        });
    };

    const editPayments = async (id) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.put(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-payment/`, {
                id: id,
                money_for: editpayment,
                total: edittotal,
                date: editDate,
                notes: editNotes,
            }, {
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            seteditpaymentID(null);
            setpaymentData([]);
            fetchPayments();
        } catch (error) {
            console.error('Error saving supply', error);
            alert("An error happened while saving the Employee. Please try again.");
        }
    };

    const deletPayemnt = async (id) => {
        try {
            const newAccessToken = await refreshAccessToken();

            await axios.delete(`${import.meta.env.VITE_API_URL}/${userData.user_name}/edit-payment/`, {
                data: { id: id },
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            setpaymentData(paymentData.filter(income => income.id !== editpaymentID));
            fetchPayments();
        } catch (error) {
            console.error('Error deleting supply', error);
            alert("An error happened while deleting the supply. Please try again.");
        }
    };



    return (<StyledWrapper>
        <BackGround className="Container">
            <TopBar drawerButton_Onclick={toggleDrawer(true)} backButton_Onclick={backToMain} Text={t("payment")} />
            <Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

            <Card className="ItemsContainer">
                <div className="Firstrow">
                    <InputField placeholder={t("reason")} type="text" value={moneyFor} onChange={(e) => setmoneyFor(e.target.value)} className="first-field" />
                    <InputField placeholder={t("total")} type="number" value={total} onChange={(e) => settotal(e.target.value)} className="first-field" />
                </div>
                <div className="Secondrow">
                    <InputField placeholder={t("date")} type="date" value={paymentDate} onChange={(e) => setpaymentDate(e.target.value)} className="note-field" />
                    <InputField placeholder={t("notes")} type="text" value={notes} onChange={(e) => setnotes(e.target.value)} className="note-field" />
                </div>

                <div className="Thirdrow">
                    <p style={{ color: 'white' }}>{paymentAdded}</p>
                </div>

                <div className="Fourthrow">
                    <Button className="Add" onClick={send_data}>{t("pay")}</Button>
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
                            <TableHead>{t("reason")}</TableHead>
                            <TableHead>{t("total")}</TableHead>
                            <TableHead>{t("date")}</TableHead>
                            <TableHead>{t("notes")}</TableHead>
                            <TableHead>{t("actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="Tablebody">
                        {paymentData.map((payment, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editpaymentID === payment.id ? (
                                        <InputField
                                            className="Table-Input-Field"
                                            type="text"
                                            value={editpayment}
                                            onChange={(e) => seteditpayment(e.target.value)}
                                        />
                                    ) : (
                                        payment.money_for
                                    )}
                                </TableCell>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editpaymentID === payment.id ? (
                                        <InputField
                                            className="Table-Input-Field"
                                            type="text"
                                            value={edittotal}
                                            onChange={(e) => setEdittotal(e.target.value)}
                                        />
                                    ) : (
                                        payment.total
                                    )}
                                </TableCell>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editpaymentID === payment.id ? (
                                        <InputField
                                            className="Table-Input-Field"
                                            type="date"
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                        />
                                    ) : (
                                        payment.date
                                    )}
                                </TableCell>
                                <TableCell style={{ fontSize: '20px', padding: '10px' }}>
                                    {editpaymentID === payment.id ? (
                                        <InputField
                                            className="Table-Input-Field"
                                            type="text"
                                            value={editNotes}
                                            onChange={(e) => setEditNotes(e.target.value)}
                                        />
                                    ) : (
                                        payment.notes
                                    )}
                                </TableCell>
                                <TableCell className='ButtonsCell'>
                                    {editpaymentID === payment.id ? (
                                        <Button className='TableButton' onClick={() => editPayments(payment.id)}>{t("save")}</Button>
                                    ) : (
                                        <Button className='TableButton' onClick={() => {
                                            seteditpaymentID(payment.id);
                                            seteditpayment(payment.money_for);
                                            setEditDate(payment.date);
                                            setEdittotal(payment.total);
                                            setEditNotes(payment.notes)
                                        }}>{t("edit")}</Button>
                                    )}
                                    <Button className='TableButton' onClick={() => deletPayemnt(payment.id)} >{t("delete")}</Button>
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

.Secondrow{
    display:flex;
    felx-direction:row;
    align-items:center;
    justify-content:center;
    
    margin-top:-3em;

    padding:1em;
    height:6em;
}

.note-field{
    width:10em;
    margin-left:1em;
    margin-right:1em;
    margin-top:2px;
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
    
    margin-top:-3em;

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

.Add{
    margin-top:10px;
}
  

@media (max-width: 768px) {
    .TopBarText{
        margin-left:18px;
        font-size:15px;
    }

    .ItemsContainer{
        margin-top: 5em;
        margin-left:0.5em;
        margin-right:0.5em;
        margin-bottom:1.5em;

        padding:0.5em;

        width:95vw;
        height: 250px;

        overflow:auto;
    }

    

    .Firstrow{
        margin-top:1em;
        width:350px;
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
    }

    .first-field{
        margin:0.2em;
    }

    .note-field{
        width:40vw;
    }
}  
`;


export default Payments