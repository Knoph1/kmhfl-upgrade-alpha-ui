import Head from 'next/head'
import Link from 'next/link'
import MainLayout from '../../components/MainLayout'
import { DotsHorizontalIcon, DownloadIcon, PlusIcon } from '@heroicons/react/solid'
import { checkToken } from '../../controllers/auth/auth'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon, FilterIcon } from '@heroicons/react/outline'
import { useFormik } from 'formik'
import { SearchIcon } from '@heroicons/react/solid'


import Select from 'react-select'

// @mui imports
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Alert from '@mui/material/Alert';
import NativePickers from '../../components/date-picker'
// import { PermissionContext } from '../../providers/permissions'
import FacilitySideMenu from '../../components/FacilitySideMenu'



const Home = (props) => {
    const router = useRouter()


   
    const facilities = props?.data?.results
    const filters = props?.filters
    let fltrs = filters
    const [drillDown, setDrillDown] = useState({})
    // const qf = props?.query?.qf ?? null

    // console.log({path:router.query.qf})
   
    if(filters && fltrs){
        filters["has_edits"] = [{ id: "has_edits", name: "Has edits" },]
        filters["is_approved"] = [{ id: "is_approved", name: "Is approved" }]
        filters["is_complete"] = [{ id: "is_complete", name: "Is complete" }]
        filters["number_of_beds"] = [{ id: "number_of_beds", name: "Number of beds" }]
        filters["number_of_cots"] = [{ id: "number_of_cots", name: "Number of cots" }]
        filters["open_whole_day"] = [{ id: "open_whole_day", name: "Open whole day" }]
        filters["open_weekends"] = [{ id: "open_weekends", name: "Open weekends" }]
        filters["open_public_holidays"] = [{ id: "open_public_holidays", name: "Open public holidays" }]


        delete fltrs.has_edits
        delete fltrs.is_approved
        delete fltrs.is_complete
        delete fltrs.number_of_beds
        delete fltrs.number_of_cots
        delete fltrs.open_whole_day
        delete fltrs.open_weekends
        delete fltrs.open_public_holidays
    }


  

    const multiFilters = ['service_category', 'service', 'county', 'subcounty', 'ward', 'constituency']

   

    const [fromDate, setFromDate] = React.useState(new Date());
    const [toDate, setToDate] = React.useState(new Date());
    const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
    const [title, setTitle] = useState('Facilities') 

    // quick filter themes
    
   
    const [khisSynched, setKhisSynched] = useState(false);
    const [facilityFeedBack, setFacilityFeedBack] = useState([])
    const [pathId, setPathId] = useState(props?.path.split('id=')[1] || '') 
    const [allFctsSelected, setAllFctsSelected] = useState(true);



    useEffect(() => {
    
     
        let qry = props?.query
        
        delete qry.searchTerm
        delete qry.qf
        setDrillDown({ ...drillDown, ...qry })

        return () => {
            
        }
    }, [facilityFeedBack, title])


    const handleDates=(from, to) => {
        setFromDate(from);
        setToDate(to);
    
     }

 

    const handleAccordionExpand = (ev) => {
        if(isAccordionExpanded){
            setIsAccordionExpanded(false)
        }else{
            setIsAccordionExpanded(true)
        }
        
    }

  
    const search = useFormik({
        initialValues:{
            search_input:''
        },
        onSubmit:({search_input}) => {

            const filters = router.asPath.split('?')[1] 
            switch(filters){
                case 'qf=all':
                    router.push(`/facilities/?qff=all&searchTerm=${search_input}`)
                case 'qf=approved&approved=true&approved_national_level=true&rejected=false':
                    router.push(`/facilities/?qff=approved&searchTerm=${search_input}`)
                break;
                case 'qf=new_pending_validation&pending_approval=true&has_edits=false&is_complete=true':
                    router.push(`/facilities/?qff=pending_validation&searchTerm=${search_input}`)
                break;
                case 'qf=updated_pending_validation&has_edits=true&pending_approval=true':
                    router.push(`/facilities/?qff=updated_pending_validation&searchTerm=${search_input}`)
                break;
                case 'qf=to_publish&to_publish=true':
                    router.push(`/facilities/?qff=pending_approval&searchTerm=${search_input}`)
                break;
                case 'qf=dhis_synced_facilities&approved=true&approved_national_level=true&rejected=false&reporting_in_dhis=true':
                    router.push(`/facilities/?qff=dhis_synched&searchTerm=${search_input}`)
                break;
                case 'qf=incomplete&is_complete=false':
                    router.push(`/facilities/?qff=incomplete&searchTerm=${search_input}`)
                break;
            }

        },
    })

    return (
        <>
            <Head>
                <title>KMHFL - Facilities</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout isLoading={false} searchTerm={props?.query?.searchTerm}>
                <div className="w-full grid grid-cols-5 gap-4 px-1 md:px-4 md:mt-3 ">
                    <div className="col-span-5 flex flex-col gap-4 px-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:text-base ">
                            {/* Bread Crumbs */}

                            <div className="flex flex-row items-center justify-between gap-2 text-sm md:text-base py-3">
                                <Link className="text-green-800" href="/">Home</Link> {'/'}
                                <span className="text-gray-500">Facilities</span>
                            </div>

                            {/* Accordion Filter */}

                            <Accordion sx={{my:1, width:'100%', boxShadow:'none', border:'solid 1px #d5d8de', borderRadius:1}} expanded={isAccordionExpanded} onChange={handleAccordionExpand}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                >
                                                
                                                <h2 className='my-2 font-semibold text-xl text-black flex items-center space-x-2'>
                                                <FilterIcon className='w-6 h-6 text-black'/>
                                                    <p> Filter Facilities By ...</p></h2>
                                            </AccordionSummary>
                                            <AccordionDetails sx={{width:'100%', padding:4, height:'auto' }}>
                                            <div className="flex flex-col gap-2">
                                                        {filters && filters?.error ?
                                                            (<div className="w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base">
                                                                <p>No filters.</p>
                                                            </div>)
                                                            : (
                                                                <div className='grid grid-cols-4 place-content-center items-content-end gap-2'>
                                                                    {filters && Object.keys(filters).length > 0 &&
                                                                        Object.keys(fltrs).map((ft, i) => (
                                                                            <div key={i} className="w-full flex flex-col items-start justify-start gap-1 mb-1">
                                                                                <label htmlFor={ft} className="text-gray-600 capitalize text-sm">{ft.split('_').join(' ')}</label>
                                                                                <Select isMulti={multiFilters.includes(ft)} name={ft} defaultValue={drillDown[ft] || ""} id={ft} className="w-full p-1 rounded bg-gray-50"
                                                                                    options={
                                                                                        Array.from(filters[ft] || [],
                                                                                            fltopt => {
                                                                                                return {
                                                                                                    value: fltopt.id, label: fltopt.name
                                                                                                }
                                                                                            })
                                                                                    }
                                                                                    placeholder={ft.split('_').join(' ')[0].toUpperCase() + ft.split('_').join(' ').slice(1)}
                                                                                    onChange={sl => {
                                                                                        let nf = {}
                                                                                        if (Array.isArray(sl)) {
                                                                                            nf[ft] = (drillDown[ft] ? drillDown[ft] + ',' : '') + Array.from(sl, l_ => l_.value).join(',')
                                                                                        } else if (sl && sl !== null && typeof sl === 'object' && !Array.isArray(sl)) {
                                                                                            nf[ft] = sl.value
                                                                                        } else {
                                                                                            delete nf[ft]
                                                                                           
                                                                                        }
                                                                                        setDrillDown({ ...drillDown, ...nf })
                                                                                    }} />
                                                                            </div>
                                                                        ))}
                                                                    {/* From and To Date Picker Components */}

                                                                    <NativePickers onSelected={
                                                                        handleDates
                                                                    }></NativePickers>
                                                                    

                                                                    {/* Yes/No Dialog */}
                                                                    <div className="w-full col-span-3 grid grid-cols-4  mb-3">
                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                            <span className='inline-flex gap-2'>
                                                                                <label htmlFor="has_edits" className="text-gray-700 capitalize text-sm">Has edits</label>
                                                                                <input type="checkbox" className="justify-self-end" value={false} defaultChecked={props?.query?.has_edits === "true"} name="has_edits" id="has_edits" onChange={ev => {
                                                                                    setDrillDown({ ...drillDown, 'has_edits': true })
                                                                                }} />
                                                                            </span>
                                                                            

                                                                            <span className='inline-flex gap-2'>
                                                                                <label htmlFor="is_approved" className="text-gray-700 capitalize text-sm">Approved</label>
                                                                                <input type="checkbox" className="justify-self-end" value={true} defaultChecked={props?.query?.is_approved === "true"} name="is_approved" id="is_approved" onChange={ev => {
                                                                                    setDrillDown({ ...drillDown, 'is_approved': true })
                                                                                }} />   
                                                                            </span>
                                                                        </div>

         
                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                                <span className='inline-flex gap-2'>
                                                                                <label htmlFor="is_complete" className="text-gray-700 capitalize text-sm">Complete</label>
                                                                        
                                                                                    <input type="checkbox" className="justify-self-end" value={true} defaultChecked={props?.query?.is_complete === "true"} name="is_complete" id="is_complete" onChange={ev => {
                                                                                        setDrillDown({ ...drillDown, 'is_complete': true })
                                                                                    }} />
                                                                                </span>
                                                                        
                                                                        
                                                                                <span className='inline-flex gap-2'>
                                                                            <label htmlFor="number_of_beds" className="text-gray-700 capitalize text-sm">Has beds</label>
                                                                        
                                                                            <input type="checkbox" className="justify-self-end" value={true} defaultChecked={props?.query?.number_of_beds === "true"} name="number_of_beds" id="number_of_beds" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'number_of_beds': true })
                                                                            }} />
                                                                            </span>
                                                                        </div>
                                                                        

                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                                    <span className='inline-flex gap-2'>
                                                                            <label htmlFor="number_of_cots" className="text-gray-700 capitalize text-sm">Has cots</label>
                                                                        
                                                                            <input type="checkbox" className="justify-self-end" value={true} defaultChecked={props?.query?.number_of_cots === "true"} name="number_of_cots" id="number_of_cots" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'number_of_cots': true })
                                                                            }} />
                                                                            </span>
                                                                        
                                                                            <span className='inline-flex gap-2'>
                                                                            <label htmlFor="open_whole_day" className="text-gray-700 capitalize text-sm">Open 24 hours</label>
                                                                        
                                                                            <input type="checkbox" className="justify-self-end" value={true} defaultChecked={props?.query?.open_whole_day === "true"} name="open_whole_day" id="open_whole_day" onChange={ev => {
                                                                                setDrillDown({ ...drillDown, 'open_whole_day': true })
                                                                            }} />
                                                                            </span>
                                                                        </div>
                                                                    
                                                                        <div className='flex flex-col items-start justify-center gap-1'>
                                                                                    <span className='inline-flex gap-2'>
                                                                        <label htmlFor="open_weekends" className="text-gray-700 capitalize text-sm">Open weekends</label>
                                                                        
                                                                        <input type="checkbox" className="justify-self-end" value={true} defaultChecked={props?.query?.open_weekends === "true"} name="open_weekends" id="open_weekends" onChange={ev => {
                                                                            setDrillDown({ ...drillDown, 'open_weekends': true })
                                                                        }} />
                                                                        </span>
                                                                        
                                                                        <span className='inline-flex gap-2'>
                                                                        <label htmlFor="open_public_holidays" className="text-gray-700 capitalize text-sm">Open holidays</label>
                                                                    
                                                                    <input type="checkbox" className="justify-self-end" value={true} defaultChecked={props?.query?.open_public_holidays === "true"} name="open_public_holidays" id="open_public_holidays" onChange={ev => {
                                                                        setDrillDown({ ...drillDown, 'open_public_holidays': true })
                                                                    }} />
                                                                        </span>
                                                                        </div>
                                                                        
                                                                    
                                                                    </div>
                                                                    <button onClick={ev => {
                                                                        if (Object.keys(drillDown).length > 0) {
                                                                            let qry = Object.keys(drillDown).map(key => {
                                                                                let er = ''
                                                                                if (props.path && !props.path.includes(`${key}=`)) {
                                                                                    er = `${encodeURIComponent(key)}=${encodeURIComponent(drillDown[key])}`;
                                                                                }
                                                                                return er
                                                                            }).join('&')
                                                                            let op = '/?'
                                                                            if (props.path && props.path.includes('?') && props.path.includes('=')) { op = '&' }
                                                                            
                                                                            if (router || typeof window == 'undefined') {
                                                                                console.log({filterQuery: `${props.path}${op}${qry}`})
                                                                                router.push(`${props.path}${op}${qry}`)
                                                                            } else {
                                                                                if (typeof window !== 'undefined' && window) {
                                                                                    window.location.href = `${props.path}${op}${qry}`
                                                                                }
                                                                            }

                                                                        }
                                                                        setIsAccordionExpanded(false)
                                                                    }} className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center">Filter</button>
                                                                    
                                                                    <button className="bg-white border-2 border-black text-black hover:bg-black focus:bg-black active:bg-black font-semibold px-5 py-1 text-base rounded hover:text-white focus:text-white active:text-white w-full whitespace-nowrap text-center" onClick={ev => {
                                                                        router.reload()
                                                                    }}>Clear filters</button>
                                                                    
                                                                </div>
                                                            )
                                                        }
                                             </div>
                                            </AccordionDetails>
                            </Accordion> 
                        
                        </div>
                        
                        {/* Buttons section */}

                        <div className="flex flex-wrap gap-2 text-sm md:text-base py-3 items-center justify-between">
                            <div className="flex flex-col items-start justify-start gap-y-1">
                                <h1 className="text-4xl tracking-tight font-bold leading-tight flex items-center justify-start gap-x-2">
                                    { title }
                                </h1>
                           
                            </div>
                            {/* dropdown options to download data */}
                            {props?.current_url && props?.current_url.length > 5 && <Menu as="div" className="relative">
                                {/* Button group */}
                             
                                {
                                (allFctsSelected || pathId === 'all') &&
                                <div className='flex items-center space-x-6 w-auto'>
                                    {/* Search Input form */}
                                    <form
                                        onSubmit={search.handleSubmit}
                                        className="inline-flex flex-row justify-start flex-grow gap-x-2 py-2 lg:py-0"
                                        
                                        >
                                        {/* Search Input */}
                                        <input
                                            name="q"
                                            id="search-input"
                                            className="flex-none bg-gray-50 rounded p-2 md:w-9/12 md:flex-grow-0 flex-grow shadow-sm border placeholder-gray-500 border-gray-200 focus:shadow-none focus:bg-white focus:border-black outline-none"
                                            type="search"
                                            onChange={search.handleChange}
                                            defaultValue={''}
                                            placeholder="Search a facility/CHU"
                                        />


                                        {/* Search Button */}
                                        <button
                                            type="submit"
                                            className="bg-white border-2 border-black text-black flex items-center justify-center px-4 py-1 rounded"
                                        >
                                            <SearchIcon className="w-5 h-5" />
                                        </button>
                                    </form>

                                    

                                    {/* Facility Button */}
                                   <Menu.Item as="div"  className="px-4 py-2 bg-green-700 text-white text-md tracking-tighter font-semibold whitespace-nowrap rounded hover:bg-black focus:bg-black active:bg-black uppercase">
                                        <button  onClick={() => {router.push('/facilities/add')}} className='flex items-center justify-center'>

                                            <span className='text-base uppercase font-semibold'>Add Facility</span>
                                            <PlusIcon className="w-4 h-4 ml-2" />
                                        </button>
                                    </Menu.Item>

                                     {/* Export Button */}
                                     <Menu.Button as="button" className="px-4 py-2 bg-green-700 text-white text-md tracking-tighter font-semibold flex items-center justify-center whitespace-nowrap rounded hover:bg-black focus:bg-black active:bg-black uppercase">
                                        <DownloadIcon className="w-5 h-5 mr-1" />
                                        <span className='text-base uppercase font-semibold'>Export</span>
                                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                                    </Menu.Button>
                                </div>
                                }
                            
                                <Menu.Items as="ul" className="absolute top-10 right-0 flex flex-col gap-y-1 items-center justify-start bg-white rounded shadow-lg border border-gray-200 p-1 w-1/2">
                                   
                                    <Menu.Item as="li" className="p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200">
                                        {({ active }) => (
                                            <button className={"flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full " + (active ? 'bg-gray-200' : '')} onClick={() => {
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += `&format=csv&access_token=${props.token}` } else { dl_url += `?format=csv&access_token=${props.token}` }
                                                console.log('Downloading CSV. ' + dl_url || '')
                                                // window.open(dl_url, '_blank', 'noopener noreferrer')
                                                window.location.href = dl_url
                                            }}>
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span className='text-base uppercase font-semibold'>CSV</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item as="li" className="p-0 flex items-center w-full text-center hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200">
                                        {({ active }) => (
                                            <button className={"flex items-center justify-start text-center hover:bg-gray-200 focus:bg-gray-200 text-gray-800 font-medium active:bg-gray-200 py-2 px-1 w-full " + (active ? 'bg-gray-200' : '')} onClick={() => {
                                                let dl_url = props?.current_url
                                                if (dl_url.includes('?')) { dl_url += `&format=excel&access_token=${props.token}` } else { dl_url += `?format=excel&access_token=${props.token}` }
                                                console.log('Downloading Excel. ' + dl_url || '')
                                                // window.open(dl_url, '_blank', 'noopener noreferrer')
                                                window.location.href = dl_url
                                            }}>
                                                <DownloadIcon className="w-4 h-4 mr-1" />
                                                <span>Excel</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>}
                      

                        </div>
                    </div>

                  

                    {/* Side Menu Filters*/}
                    <FacilitySideMenu 
                    filters={filters ?? {}}
                    states={[khisSynched, facilityFeedBack, pathId, allFctsSelected, title]}
                    stateSetters={[setKhisSynched, setFacilityFeedBack, setPathId, setAllFctsSelected, setTitle]}/>
                   
                    
                    {/* Main Body */}
                    <div className="w-full md:col-span-4 md:col-start-2  col-span-5 md:h-auto md:mb-12">
                                    {/* Data Indicator section */}
                                    <h5 className="text-lg font-medium text-gray-800 float-right mr-4 mb-2">
                                                  
                                        {props?.data?.count && props?.data?.count > 0 && <small className="text-gray-500 ml-2 text-base">{props?.data?.start_index || ''} - {props?.data?.end_index || ''} of {props?.data?.count || ''} </small>}
                                    </h5>
                        
                                    {/*  Quick Filters status display */}
                                    <div className="flex-grow w-full flex flex-col items-center gap-4 order-last md:order-none">
                                        <div className="flex flex-col justify-center items-center px-1 md:px-4 w-full ">
                                            {/* Facilities View */}
                                            {facilities && facilities.length > 0 && facilityFeedBack.length === 0 && !khisSynched &&
                                            facilities.map((facility, index) => (
                                                <div key={index} 
                                                title={`Incomplete Details : ${facility?.is_complete ? 'none' : facility?.in_complete_details}`}
                                                className="px-1 md:px-3 grid grid-cols-8 gap-2 border-b py-4 hover:bg-gray-50 w-full">
                                                    <div className="col-span-8 md:col-span-8 lg:col-span-6 flex flex-col gap-1 group items-center justify-start text-left">
                                                        <h3 className="text-2xl w-full">
                                                            <span onClick={() => router.push({pathname: `/facilities/${facility?.id}`, query: {qf: router.query.qf}})} className="cursor-pointer hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800 " >
                                                                <small className="text-gray-500">{index + props?.data?.start_index}.</small>{' '}{facility?.official_name || facility?.official_name || facility?.name}
                                                            </span>
                                                        </h3>
                                                        
                                                        <p className="text-sm text-gray-600 w-full flex gap-y-2 gap-x-5 items-center">
                                                            <span className="text-lg text-black font-semibold"># {facility?.code ? facility?.code : 'NO_CODE' || ' '}</span>
                                                            <span>{facility?.owner_name || ' '}</span>
                                                        </p>
                                                        <div className="text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full">
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">County:</label>
                                                                <span className="whitespace-pre-line">{facility?.county_name || facility?.county || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Sub-county:</label>
                                                                <span className="whitespace-pre-line">{facility?.sub_county_name || facility?.sub_county || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Ward:</label>
                                                                <span className="whitespace-pre-line">{facility?.ward_name || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Constituency:</label>
                                                                <span className="whitespace-pre-line">{facility?.constituency_name || facility?.constituency || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-8 md:col-span-8 lg:col-span-2 flex flex-wrap items-center justify-evenly gap-x-2 gap-y-1 text-lg">
                                                        {(facility?.operational || facility?.operation_status_name) ? <span className={"shadow-sm leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-green-200 text-black"}>Operational</span> : ""}
                                                        {!facility?.rejected ? <span className={"shadow-sm leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + (facility?.approved_national_level ? "bg-green-200 text-black" : "bg-gray-400 text-black")}>{facility?.approved ? facility?.is_approved ? "pending approval" : router.asPath.includes("qf=to_publish") ? "pending Approval" : "Approved" : facility?.approved_national_level ? 'Approved' : 'pending validation' }</span> : <span className={"shadow-sm leading-none whitespace-nowrap text-sm rounded text-black py-1 px-2 " + "bg-gray-400 text-black"}>{facility?.rejected ? "Rejected" : ""}</span>}
                                                        {facility?.has_edits ? <span className={"shadow-sm leading-none whitespace-nowrap text-sm rounded py-1 px-2 bg-blue-200 text-black"}>Has edits</span> : ""}
                                                    </div>
                                                </div>
                                            ))
                                            }

                                            {/* FeedBack Facilities View */}
                                            {
                                                facilityFeedBack && facilityFeedBack.length > 0  ? facilityFeedBack.map((facility, index) => (
                                                    <div key={index} className="px-1 md:px-3 grid grid-cols-8 gap-2 border-b py-4 hover:bg-gray-50 w-full">
                                                    <div className="col-span-8 md:col-span-8 lg:col-span-6 flex flex-col gap-1 group items-center justify-start text-left">
                                                        <h3 className="text-2xl w-full">
                                                            <a href={'/facilities/' + facility?.id} className="hover:text-blue-800 group-focus:text-blue-800 active:text-blue-800 ">
                                                                <small className="text-gray-500">{index + props?.data?.start_index}.</small>{' '}{facility?.facility_name}
                                                            </a>
                                                        </h3>
                                                     
                                                        <div className="text-base grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-3 w-full">
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Service:</label>
                                                                <span className="whitespace-pre-line">{facility?.service_name || facility?.county || '-'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Comment:</label>
                                                                <span className="whitespace-pre-line">{facility?.comment || facility?.county || '-'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Rating:</label>
                                                                <span className="whitespace-pre-line">{facility?.rating || facility?.sub_county || '0'}</span>
                                                            </div>
                                                            <div className="flex flex-col items-start justify-start gap-0 leading-none whitespace-pre-wrap">
                                                                <label className="text-xs text-gray-500">Date:</label>
                                                                <span className="whitespace-pre-line">{new Date(facility?.created).toLocaleDateString() || '-'}</span>
                                                            </div>
                                                          
                                                        </div>
                                                    </div>
                                                
                                                </div>
                                                )):(
                                                    
                                                    (facilities?.length === 0 && facilityFeedBack?.length == 0 || khisSynched) &&
                                                    // No Facility feedback data found
                                                    <Alert severity="warning" sx={{width:'100%'}}>No facilities found <span onClick={() => {
                                                        setTitle('Facilities')
                                                        setAllFctsSelected(true)
                                                       
    
                                                        router.push({pathname:'/facilities', query: {qf: 'all'}})
                                                    }} className='hover:underline text-indigo-700 cursor-pointer'>back to all facilities</span>
                                                    </Alert>
                                                  
                                                )

                                            }

                                            {facilities && facilities?.length >= 30 && !khisSynched && <ul className="list-none flex p-2 flex-row gap-2 w-full items-center my-2">
                                                <li className="text-base text-gray-600">
                                                    <Link href={
                                                        (() => 
                                                            props.path.includes('?page') ?
                                                            props.path.replace(/\?page=\d+/,`?page=${props?.data?.current_page}`)
                                                            :
                                                            props.path.includes('?q') && props.path.includes('&page') ?
                                                            props.path.replace(/&page=\d+/, `&page=${props?.data?.current_page}`)
                                                            :
                                                            props.path.includes('?q') ?
                                                            `${props.path}&page=${props?.data?.current_page}`                                    
                                                            :
                                                            `${props.path}?page=${props?.data?.current_page}`
                                                        )()
                                                    }>
                                                        <a className="text-gray-400 font-semibold p-2 underline">{props?.data?.current_page}</a>
                                                    </Link>
                                                </li>
                                                {props?.path && props?.data?.near_pages && props?.data?.near_pages.map((page, i) => (
                                                    <li key={i} className="text-base text-gray-600">
                                                        <Link href={(() => 
                                                            props.path.includes('?page') ?
                                                            props.path.replace(/\?page=\d+/,`?page=${page}`)
                                                            :
                                                            props.path.includes('?q') && props.path.includes('&page') ?
                                                            props.path.replace(/&page=\d+/, `&page=${page}`)
                                                            :
                                                            props.path.includes('?q') ?
                                                            `${props.path}&page=${page}`
                                                            :
                                                            `${props.path}?page=${page}`
                   
                                                        )()}>
                                                            <a className="text-blue-800 p-2 hover:underline">{page}</a>
                                                        </Link>
                                                    </li>
                                                ))}
                                                <li className="text-sm text-gray-400 flex">
                                                    <DotsHorizontalIcon className="h-3" />
                                                </li>
                                               

                                            </ul>}
                                        </div>
                                    </div>
                             
                    </div>

                  
                    {/* Floating div at bottom right of page */}
                    <div className="fixed bottom-4 right-4 z-10 w-96 h-auto bg-yellow-50/50 bg-blend-lighten shadow-lg rounded-lg flex flex-col justify-center items-center py-2 px-3">
                        <h5 className="text-sm font-bold">
                            <span className="text-gray-600 uppercase">Limited results</span>
                        </h5>
                        <p className="text-sm text-gray-800">
                            For testing reasons, downloads are limited to the first 100 results.
                        </p>
                    </div>
                   
                </div>
            </MainLayout >
        </>
    )
}

Home.getInitialProps = async (ctx) => {

    const API_URL = process.env.NEXT_PUBLIC_API_URL 
    const fetchFilters = token => {
        let filters_url = API_URL + '/common/filtering_summaries/?fields=county%2Cfacility_type%2Cconstituency%2Cward%2Coperation_status%2Cservice_category%2Cowner_type%2Cowner%2Cservice%2Ckeph_level%2Csub_county'

        return fetch(filters_url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return json
            }).catch(err => {
                console.log('Error fetching filters: ', err)
                return {
                    error: true,
                    err: err,
                    filters: []
                }
            })
    }

    const fetchData = (token) => {

        let url = API_URL + '/facilities/facilities/?fields=id,code,official_name,facility_type_name,owner_name,county,sub_county,constituency_name,ward_name,updated,operation_status_name,sub_county_name,name,is_complete,in_complete_details,approved_national_level,has_edits,approved,rejected,keph_level'
     
        let query = { 'searchTerm': '' }
        if (ctx?.query?.qf) {
            query.qf = ctx.query.qf
        
        }
        if (ctx?.query?.q) {
            query.searchTerm = ctx.query.q
            url += `&search={"query":{"query_string":{"default_field":"name","query":"${query.searchTerm}"}}}`
        }

        if(ctx?.query?.qff){
            switch(ctx?.query?.qff){
                case 'all':
                    url += `search=${ctx?.query?.search}`
                    break;
                case 'approved':
                    url += `search=${ctx?.query?.search}`
                case 'pending_validation':
                case 'updated_pending_validation':
                case 'dhis_synched':
                
            }
        }


        let other_posssible_filters = [
            "owner_type", 
            "service", 
            "facility_type", 
            "county", 
            "service_category", 
            "sub_county", 
            "keph_level", 
            "owner", 
            "operation_status", 
            "constituency", 
            "ward", 
            "has_edits", 
            "rejected_national",
            "rejected",
            "closed",
            "is_approved", 
            "is_complete", 
            "number_of_beds", 
            "number_of_cots", 
            "incomplete",
            "open_whole_day",
            "to_publish", 
            "dhis_synced_facilities",
            "open_weekends",
            "approved",
            "reporting_in_dhis",
            "pending_approval",
            "approved_national_level",
            "admitting_maternity_general", 
            "admitting_maternity_only",
            "open_public_holidays"]

        other_posssible_filters.map(flt => {
            if (ctx?.query[flt]) {
                query[flt] = ctx?.query[flt]
                url = `${url}&${flt}=${ctx?.query[flt]}`
               
            }


            // Remove approved field if fetching for Facilities pending approval
            // if (flt === 'to_publish') url = url.replace('approved,', '')

        })


        let current_url = url + '&page_size=100'
        if (ctx?.query?.page) {
            url = `${url}&page=${ctx.query.page}`
        }

    


        return fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        }).then(r => r.json())
            .then(json => {
                return fetchFilters(token).then(ft => {
                    return {
                        data: json, query,token, filters: { ...ft }, path: ctx.asPath || '/facilities', current_url: current_url
                    }
                })
            }).catch(err => {
                console.log('Error fetching facilities: ', err)
                return {
                    error: true,
                    err: err,
                    data: [],
                    query: {},
                    path: ctx.asPath || '/facilities',
                    current_url: ''
                }
            })
    }

    return checkToken(ctx.req, ctx.res).then(t => {
        if (t.error) {
            throw new Error('Error checking token')
        } else {
            let token = t.token
            return fetchData(token).then(t => t)
        }
    }).catch(err => {
        console.log('Error checking token: ', err)
        if (typeof window !== 'undefined' && window) {
            if (ctx?.asPath) {
                window.location.href = ctx?.asPath
            } else {
                window.location.href = '/facilities'
            }
        }
        setTimeout(() => {
            return {
                error: true,
                err: err,
                data: [],
                query: {},
                path: ctx.asPath || '/facilities',
                current_url: ''
            }
        }, 1000);
    })

}

export default Home