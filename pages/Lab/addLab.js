import {useState, useEffect} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie';
import Header from '../components/Header'
import SideNavbar from '../components/SideNavbar'
import styles from '../../styles/Home.module.css'
import Multiselect from 'multiselect-react-dropdown';
import api from '../components/api.js'
import Modal from 'react-bootstrap/Modal';

export async function getServerSideProps(context) {
    const {params,req,res,query} = context
    const {patient_id_Medical_Record} = query.mrn
    const token = req.cookies.token
    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    const accesstoken = token
    const authaxios = axios.create({
        baseURL : api,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })
    const data = await authaxios.get(`${api}/labpanel`)
    
    return {
        props: {
            LabPanel :data.data,
        }, // will be passed to the page component as props
    }
}

export default function AddLab({LabPanel}) {
    const router = useRouter();
    const cookies = new Cookies();
    const accesstoken = cookies.get('token')
    const { mrn } = router.query
    const [PatientId, setPatientId] = useState(mrn)
    const [PanelId,setPanelId] = useState([])
    const getclinic = cookies.get('clinic')
    const [Clinic,setClinic] = useState(getclinic)
    const [show, setShow] = useState(false);
    const handleClose = () => { 
        setShow(false)
    }
    const handleShow = () => setShow(true);
   const handleClear = ()=>{
            
    }
    const authaxios = axios.create({
        baseURL : api,
        headers :{
            Authorization : `Bearer ${accesstoken} `
        }
    })
    

    const handlesubmit = async (e)=>{
        e.preventDefault()
        await authaxios.post(`${api}/orderlab`,{
            PatientId:parseInt(PatientId),
            PanelId:PanelId,
            Clinic:parseInt(Clinic)
        }).then(function (response) {
            handleShow()
            router.push(`/Lab/${PatientId}`)
        }).catch(function (error) {
            console.log(error);
        });
    }
    return (
        <div className={styles.home}>
            <SideNavbar mrn={mrn}/>
            <div className={styles.homeContainer}>
                <Header />
                <form onSubmit={handlesubmit} className="bg-light pt-3">
                    <Container>
                          <Row className="my-3">
                             <Col md="12">
                                   <Multiselect
                                      displayValue="Name"
                                      placeholder = "select MRI"
                                      onKeyPressFn={function noRefCheck(){}}
                                      onRemove={function noRefCheck(){}}
                                      onSearch={function noRefCheck(){}}
                                      onSelect={(e)=>{
                                         e.map((data,index)=>(
                                            setPanelId([...PanelId, data.id])
                                         ))
                                      }}
                                      options={LabPanel}
                                   />
                                </Col>
                          </Row>
                       <Button type="submit" variant="primary">Submit</Button>
                    </Container>

                    <Modal size="lg" show={show} onHide={handleClose} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
                                    <Modal.Header closeButton>
                                        
                                    </Modal.Header>
                                    <Modal.Body>
                                        <h5>Succefully add new Lab</h5>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                </form >
            </div>
        </div>
    )
}

