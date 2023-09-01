import React, { useState } from 'react'
import { Table, Container, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import { data } from '../data/data'
import CpiHistogram from './CpiHistogram'
import BranchPieChart from './pie'

// function sortData ({tableData, sortKey, reverse}) {
//     if(!sortKey)
//         return tableData

//     const sortedData = data.sort((a, b) => {
//         return a[sortKey] > b[sortKey] ? 1 : -1
//     })

//     if(reverse) {
//         return sortedData.reverse();
//     }

//     return sortedData
// }

// function SortButton(sortOrder, columnKey, sortKey, onClick) {
//     return <button onClick={onClick}>
//         &#916;
//     </button>
// }

const searchMatch = (search, item) => {
    if (search.toLocaleLowerCase() === '')
        return true;
    else if (item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        return true
    else if (item.branch.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        return true
    else if (item.cpi.toString().slice(0, -3).includes(search))
        return true
    else
        return false
}

const CPIMatch = (minCPI, maxCPI, item) => {
    if (parseFloat(item.cpi.toString().slice(0, -3)) >= minCPI && parseFloat(item.cpi.toString().slice(0, -3)) <= maxCPI)
        return true;
    else
        return false;
}

const deptMatch = (dept, item) => {
    if(dept === '')
        return true
    else if(item.branch.toLocaleLowerCase() === dept.toLocaleLowerCase())
        return true
    else
        return false
}

const DataTable = () => {
    const [search, setSearch] = useState('')
    const [minCPI, setMinCPI] = useState(0)
    const [maxCPI, setMaxCPI] = useState(10)
    const [dept, setDept] = useState('')
    const [score, setScore] = useState([])
    // const [resumeData, setResumeData] = useState(data)
    // const [order, setOrder] = useState("ASC")

    // const sorting = (col) => {
    //     if(order === "ASC") {
    //         const sorted = [...resumeData].sort((a, b) => 
    //             a[col] > b[col] ? 1 : -1
    //         );
    //         setResumeData(sorted)
    //         setOrder("DSC")
    //     }
    //     if(order === "DSC") {
    //         const sorted = [...resumeData].sort((a, b) => 
    //             a[col] < b[col] ? 1 : -1
    //         );
    //         setResumeData(sorted)
    //         setOrder("ASC")
    //     }
    // }

    const header = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "branch", label: "Department" },
        { key: "cpi", label: "CPI" },
        { key: "score", label: "Test Score" },
    ]

    const departments = [
        { key: "ae", label: "Aerospace Engineering" },
        { key: "bsbe", label: "Biological Science and Biotechnology Engineering" },
        { key: 'che', label: "Chemical Engineering" },
        { key: 'ce', label: "Civil Engineering" },
        { key: 'cse', label: "Computer Science and Engineering"},
        { key: 'es', label: "Earth Science" },
        { key: 'eco', label: "Economics" },
        { key: 'ee', label: "Electrical Engineering" },
        { key: 'mse', label: "Material Science Engineering" },
        { key: 'mth', label: "Mathematics and Scientific Computing" },
        { key: "me", label: "Mechanical Engineering" },
        { key: 'phy', label: "Physics" },
        { key: 'sde', label: "Statistic and Data Science" },
    ]

    // const [sortKey, setSortKey] = useState("id")
    // const [sortOrder, setSortOrder] = useState("ascn")

    // const sortedData = useCallback(() => sortData({tableData: data, sortKey, reverse: sortOrder === "desc"}), 
    // [data, sortKey, sortOrder])

    // function changeSort(key) {
    //     setSortOrder(sortOrder === "ascn" ? "desc" : "ascn")
    //     setSortKey(key)
    // }

    return (
        <div>
            <Container>
                <h1 className='text-center mt-4'>Resumate</h1>
                <CpiHistogram data={data} dept={dept} />
                <BranchPieChart data={data} minCPI={minCPI} maxCPI={maxCPI} />
                <Form>
                    <InputGroup className='my-3'>
                        <Form.Control
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='Search' />
                    </InputGroup>

                    <InputGroup className='my-3'>
                        <InputGroup.Text>CPI</InputGroup.Text>

                        <Form.Control
                            onChange={(e) => setMinCPI(e.target.value)}
                            placeholder='Min CPI' />

                        <Form.Control
                            onChange={(e) => {
                                if (!e.target.value)
                                    setMaxCPI(10)
                                else
                                    setMaxCPI(e.target.value)
                            }}
                            placeholder='Max CPI' />
                    </InputGroup>

                    <InputGroup className='my-3'>
                        <InputGroup.Text>Department</InputGroup.Text>

                        <DropdownButton
                            variant="outline-secondary"
                            title="Dropdown"
                            placeholder="Department"
                        >
                            <Dropdown.Item onClick={() => setDept('')}>Select</Dropdown.Item>
                            <Dropdown.Divider />
                            {departments.map((department) => (
                                <Dropdown.Item onClick={() => setDept(department.label)}>{department.label}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </InputGroup>
                </Form>



                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {header.map((head) => {
                                return <th key={head.key}>
                                    {head.label}
                                    {/* <SortButton 
                                            columnKey={head.key}
                                            onClick={() => changeSort(head.key)}
                                            {...{
                                                sortOrder,
                                                sortKey
                                            }}
                                            sortOrder={sortOrder}
                                            sortKey={sortKey}
                                        /> */}
                                </th>
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {data.filter((item) => {
                            if (searchMatch(search, item) && CPIMatch(minCPI, maxCPI, item) && deptMatch(dept, item))
                                return item
                            // if (search.toLocaleLowerCase() === '')
                            //     return item;
                            // else if (item.name.toLocaleLowerCase().includes(search))
                            //     return item.name.toLocaleLowerCase().includes(search);
                            // else if (item.branch.toLocaleLowerCase().includes(search))
                            //     return item.branch.toLocaleLowerCase().includes(search);
                            // else
                            //     return item.cpi.toString().includes(search);
                        }).map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.branch}</td>
                                <td>{item.cpi.toString().slice(0, -3)}</td>
                                <td>
                                    <Form>
                                        <InputGroup>
                                            <Form.Control placeholder='N/A' />
                                        </InputGroup>
                                    </Form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

export default DataTable
